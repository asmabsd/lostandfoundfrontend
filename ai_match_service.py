from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator, ConfigDict
from typing import List, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime, date
import base64
import os
import logging
from PIL import Image
import io
import re
import mysql.connector
from mysql.connector import Error

# Configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf
tf.get_logger().setLevel('ERROR')

# Configuration de la base de données
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'item_data_base',
    'port': 3306
}

# Chemin de base pour les images
BASE_IMAGE_PATH = "C:/Users/asmab/Downloads/springboot-3-micro-service-demo-main/springboot-3-micro-service-demo-main/uploads/"

# Modèle ResNet50
IMG_MODEL = tf.keras.applications.ResNet50(
    weights='imagenet',
    include_top=False,
    pooling='avg'
)

app = FastAPI(title="Item Matching Service", version="2.1")

class Item(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    id: int
    type: str
    description: str
    location: str
    date: Optional[str] = None
    photo: Optional[str] = None  # Peut être chemin relatif ou base64
    status: str
    useremail: str

    @field_validator('photo')
    @classmethod
    def validate_photo(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
            
        # Si c'est déjà du base64
        if v.startswith('data:image') or (len(v) > 100 and re.match(r'^[A-Za-z0-9+/=]+$', v)):
            try:
                if v.startswith('data:image'):
                    v = v.split(',')[1]
                padding = len(v) % 4
                if padding:
                    v += '=' * (4 - padding)
                base64.b64decode(v, validate=True)
                return v
            except Exception:
                logger.warning("Invalid base64 data")
                return None
        
        # Si c'est un chemin de fichier
        full_path = os.path.join(BASE_IMAGE_PATH, v)
        if os.path.exists(full_path):
            try:
                with open(full_path, 'rb') as f:
                    return base64.b64encode(f.read()).decode('utf-8')
            except Exception as e:
                logger.error(f"Failed to read image file: {str(e)}")
                return None
        
        return None

class MatchingRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    
    reference_item_id: int
    status_filter: Optional[str] = None

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as e:
        logger.error(f"Database connection failed: {str(e)}")
        raise HTTPException(500, "Database connection error")

def get_item_from_db(item_id: int) -> Optional[dict]:
    """Récupère un item depuis la base de données"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, type, description, location, date, 
                   photo, status, useremail 
            FROM item WHERE id = %s
        """, (item_id,))
        
        item = cursor.fetchone()
        if item:
            # Convertit le chemin de l'image en base64
            if item['photo']:
                full_path = os.path.join(BASE_IMAGE_PATH, item['photo'])
                if os.path.exists(full_path):
                    with open(full_path, 'rb') as f:
                        item['photo'] = base64.b64encode(f.read()).decode('utf-8')
                else:
                    item['photo'] = None
        
        return item
    except Error as e:
        logger.error(f"Database error: {str(e)}")
        return None
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def get_candidate_items(reference_status: str, exclude_id: int) -> List[dict]:
    """Récupère les items candidats depuis la base"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        opposite_status = 'FOUND' if reference_status == 'LOST' else 'LOST'
        
        cursor.execute("""
            SELECT id, type, description, location, date, 
                   photo, status, useremail 
            FROM item
            WHERE status = %s AND id != %s
        """, (opposite_status, exclude_id))
        
        candidates = []
        for row in cursor.fetchall():
            # Convertit le chemin de l'image en base64
            if row['photo']:
                full_path = os.path.join(BASE_IMAGE_PATH, row['photo'])
                if os.path.exists(full_path):
                    with open(full_path, 'rb') as f:
                        row['photo'] = base64.b64encode(f.read()).decode('utf-8')
                else:
                    row['photo'] = None
            
            candidates.append(row)
        
        return candidates
    except Error as e:
        logger.error(f"Database error: {str(e)}")
        return []
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

def process_image(img_data: str) -> Optional[Image.Image]:
    """Convertit base64 en image PIL"""
    if not img_data:
        return None
    try:
        img_bytes = base64.b64decode(img_data)
        img = Image.open(io.BytesIO(img_bytes))
        return img.convert('RGB')
    except Exception as e:
        logger.error(f"Image processing error: {str(e)}")
        return None

def extract_features(img: Image.Image) -> np.ndarray:
    """Extrait les features d'image"""
    try:
        img = img.resize((224, 224))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = tf.keras.applications.resnet50.preprocess_input(
            np.expand_dims(img_array, axis=0))
        return IMG_MODEL.predict(img_array, verbose=0)[0]
    except Exception as e:
        logger.error(f"Feature extraction failed: {str(e)}")
        return np.zeros((2048,))

def calculate_similarity(text1: str, text2: str) -> float:
    """Calcule la similarité textuelle"""
    if not text1 or not text2:
        return 0.0
    try:
        vectorizer = TfidfVectorizer()
        tfidf = vectorizer.fit_transform([text1, text2])
        return cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    except Exception:
        return 0.0

@app.post("/ai-match")
async def match_items(request: MatchingRequest):
    """Endpoint principal pour le matching d'items"""
    try:
        # Récupère l'item de référence depuis la base
        reference = get_item_from_db(request.reference_item_id)
        if not reference:
            raise HTTPException(404, "Reference item not found")
        
        if not reference.get('photo'):
            raise HTTPException(400, "Reference item has no valid photo")
        
        # Traitement de l'image de référence
        ref_img = process_image(reference['photo'])
        if not ref_img:
            raise HTTPException(422, "Could not process reference image")
        
        ref_features = extract_features(ref_img)
        if np.all(ref_features == 0):
            raise HTTPException(422, "Failed to extract image features")
        
        # Récupère les candidats depuis la base
        candidates = get_candidate_items(reference['status'], reference['id'])
        
        # Calcul des matches
        matches = []
        for candidate in candidates:
            try:
                # Calcul des similarités
                type_sim = 1.0 if reference['type'].lower() == candidate['type'].lower() else 0.0
                desc_sim = calculate_similarity(reference['description'], candidate['description'])
                loc_sim = 1.0 if reference['location'].lower() == candidate['location'].lower() else 0.0
                
                date_sim = 0.0
                if reference.get('date') and candidate.get('date'):
                    try:
                        ref_date = reference['date']
                        cand_date = candidate['date']

                        # Normalisation en datetime.date
                        if isinstance(ref_date, datetime):
                            ref_date = ref_date.date()
                        elif isinstance(ref_date, str):
                            ref_date = datetime.strptime(ref_date, "%Y-%m-%d").date()

                        if isinstance(cand_date, datetime):
                            cand_date = cand_date.date()
                        elif isinstance(cand_date, str):
                            cand_date = datetime.strptime(cand_date, "%Y-%m-%d").date()

                        delta = abs((ref_date - cand_date).days)
                        date_sim = max(0, 1 - delta / 30)
                    except Exception as e:
                        logger.warning(f"Date similarity error: {str(e)}")

                img_sim = 0.0
                if candidate.get('photo'):
                    cand_img = process_image(candidate['photo'])
                    if cand_img:
                        cand_features = extract_features(cand_img)
                        if not np.all(cand_features == 0):
                            img_sim = max(0, float(cosine_similarity(
                                [ref_features], [cand_features])[0][0]))

                # Score pondéré
                total_score = 0.3 * type_sim + 0.4 * desc_sim + 0.15 * loc_sim + 0.1 * date_sim + 0.4 * img_sim


                if total_score >= 0.2 or img_sim >= 0.4:
                    matches.append({
                        "id": candidate['id'],
                        "score": round(total_score, 4),
                        "type": candidate['type'],
                        "location": candidate['location'],
                        "image_similarity": round(img_sim, 4),
                        "note": "Correspondance image uniquement" if total_score < 0.4 else "Match global"
                    })
            except Exception as e:
                logger.warning(f"Skipping candidate {candidate.get('id')}: {str(e)}")
                continue
        
        # Tri des résultats
        matches.sort(key=lambda x: x["score"], reverse=True)
        logger.info(f"Item {reference['id']} photo loaded: {'yes' if reference['photo'] else 'no'}")
        logger.info(f"Comparing with candidate {candidate['id']} - img_sim: {img_sim}, total_score: {total_score}")

        return {
            "reference_id": reference['id'],
            "matches": matches[:15],
            "match_count": len(matches),
            "success": True
        }
       

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(500, "Internal server error")
        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="warning"
    )
