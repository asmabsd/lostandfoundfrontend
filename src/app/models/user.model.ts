
export interface User {
  id?: number;            // Optionnel, généré par le backend
  firstName: string;
  lastName: string;
  score?: number;
  cin: string;
  premium: boolean;
  email: string;
  password: string;
  role?: string;   
  photo?:string  
}

