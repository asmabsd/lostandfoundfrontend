import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ReclamationService } from 'src/app/services/reclamation.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-itemperdu',
  templateUrl: './itemperdu.component.html',
  styleUrls: ['./itemperdu.component.scss']
})
export class ItemperduComponent implements AfterViewInit, OnDestroy {
currentUserEmail: string | null = null;
  userPremium: boolean| null = null ;
private map!: L.Map;
private marker: L.Marker | null = null;
  selectedFile?: File;

 items: Item[] = [];
 user:User| null = null;
  showForm = false;
  formMode: 'add' | 'edit' = 'add';
  currentItemId?: number;
  itemForm: FormGroup;

  constructor(private itemService:ItemService,private authService:AuthServiceService,  private fb: FormBuilder,private notificationservice:NotificationService,private reclamationservice:ReclamationService,  private http: HttpClient) {
    this.itemForm = this.fb.group({
      type: [''],
      description: [''],
      location: [''],
      date: [''],
      status: ['LOST'],
            useremail:   ['']   

    });
  }














  

ngAfterViewInit(): void {
 setTimeout(() => {
    this.initMap();
    this.observeMapContainer();
  }, 100);}
ngOnDestroy(): void {
  if (this.map) {
    this.map.remove();
  }


   this.initMap();
  
  // Observer les changements de taille du conteneur parent
  const observer = new ResizeObserver(() => {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 50);
    }
  });
  
  const mapContainer = document.getElementById('map-container');
  if (mapContainer) {
    observer.observe(mapContainer);
  }
}
initMap(): void {
  // Corriger les icônes manquantes de Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'src/assets/marker-icon-2x.png',
    iconUrl: 'src/assets/leaflet-images/marker-icon.png',
    shadowUrl: 'src/assets/leaflet-images/marker-shadow.png',
  });

  // Créer la map
  this.map = L.map('map').setView([36.8065, 10.1815], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(this.map);

  // Clic sur la carte : placer marqueur et faire géocodage inverse
  this.map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    this.setMarker(lat, lng);

    this.reverseGeocode(lat, lng).subscribe({
      next: (res: any) => {
        const address = res.display_name || 'Adresse inconnue';
        this.itemForm.get('location')?.setValue(address);
      },
      error: () => {
        this.itemForm.get('location')?.setValue('Adresse inconnue');
      }
    });
  });
}
setMarker(lat: number, lng: number): void {
  if (this.marker) {
    this.marker.setLatLng([lat, lng]);
  } else {
    this.marker = L.marker([lat, lng]).addTo(this.map);
  }
}
reverseGeocode(lat: number, lng: number): Observable<any> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  return this.http.get(url, {
    headers: {
      'User-Agent': 'YourAppName/1.0 (your.email@example.com)' // Remplace par ton mail/app
    }
  });
}

  generateDescriptionFromType(typeValue: string) {
    this.reclamationservice.generateDescription(typeValue).subscribe({
      next: (desc) => {
        this.itemForm.patchValue({ description: desc });
      },
      error: (err) => {
        console.error('Erreur génération description', err);
      }
    });
  }
  ngOnInit(): void {
    this.loadItems();

    
const email = this.authService.getUserEmail();
console.log('EMAIL RÉCUPÉRÉ →', email); // ← vérifie dans la console navigateur

this.itemForm.patchValue({ useremail: email });
 this.currentUserEmail = this.authService.getUserEmail(); // ← Important
  this.userPremium = this.user ? this.user.premium : null; // Assure-toi que l'objet user a la propriété premium
  if (this.currentUserEmail) {
    this.authService.getUserByEmail(this.currentUserEmail).subscribe(user => {
      this.user = user;
      this.userPremium = this.user ? this.user.premium : null; // Met à jour userPremium après avoir récupéré l'utilisateur
    });
  }
  this.loadItems();
  }
contacterUtilisateur(item: Item) {
  const toEmail = item.useremail?.trim();

  if (!toEmail || !toEmail.includes('@')) {
    alert('❌ Adresse email invalide ou manquante.');
    return;
  }

  const request = {
    toEmail,
    subject: 'Intérêt pour votre objet perdu publié',
    message: `Bonjour, je suis intéressé(e) par l'objet "${item.type}" que vous avez publié sur Smart Lost and Found. Pourriez-vous me contacter ?`
  };

  this.notificationservice.sendNotification(request).subscribe({
    next: () => alert('📧 Email envoyé avec succès au propriétaire !'),
    error: (err) => {
      console.error('Erreur d\'envoi de l\'email', err);
      alert('❌ Une erreur est survenue lors de l\'envoi.');
    }
  });
}



uploadImage(itemId: number) {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.itemService.uploadImage(itemId, formData).subscribe({
      next: () => this.loadItems(),
      error: err => console.error('Erreur upload image', err)
    });
  }
}
get foundItems() {
  return this.items.filter(i => i.status === 'LOST');
}
  loadItems() {
    this.itemService.getAllItems().subscribe(data => this.items = data);
  }

  onAddClick() {
   const email = this.authService.getUserEmail();
  this.itemForm.reset({
    status: 'LOST',
    useremail: email
  });
  this.formMode = 'add';
  this.showForm = true;
setTimeout(() => {
    if (this.map) {
      this.map.invalidateSize();
      this.map.setView([36.8065, 10.1815], 10); // Recentrer si nécessaire
    } else {
      this.initMap(); // Si la carte n'existe pas, l'initialiser
    }
  }, 50); // Réduire le délai

  }

  onEdit(item: Item) {
    this.itemForm.patchValue(item);
    this.currentItemId = item.id;
    this.formMode = 'edit';
    this.showForm = true;
  }

  onDelete(id: number) {
    this.itemService.deleteItem(id).subscribe(() => this.loadItems());
  }
onSubmit() {
  const itemFormValue = { ...this.itemForm.value }; 

  if (this.formMode === 'add') {
    this.itemService.createItem(itemFormValue).subscribe((createdItem) => {
      if (this.selectedFile) {
        this.uploadImage(createdItem.id!);
      } else {
        this.loadItems();
      }
      this.showForm = false;
      this.selectedFile = undefined;
    });
  } else if (this.formMode === 'edit' && this.currentItemId != null) {
    this.itemService.updateItem(this.currentItemId, itemFormValue).subscribe(() => {
      if (this.selectedFile) {
        this.uploadImage(this.currentItemId!);
      } else {
        this.loadItems();
      }
      this.showForm = false;
      this.selectedFile = undefined;
    });
  }
}
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}
  cancelForm() {
    this.showForm = false;
   
  setTimeout(() => {
    if (this.map) {
      this.map.invalidateSize();
    }
  }, 100);
}

private observeMapContainer() {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    const observer = new ResizeObserver(() => {
      if (this.map) {
        setTimeout(() => this.map.invalidateSize(), 50);
      }
    });
    observer.observe(mapElement);
  }
}
  
}
