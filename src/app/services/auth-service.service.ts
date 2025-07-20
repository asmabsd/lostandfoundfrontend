import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}
@Injectable({
  providedIn: 'root'
})


export class AuthServiceService {
 private BASE_URL = '/api/v1/users'; // API Gateway

getUserEmail(): string | null {
  return localStorage.getItem('user_email');
}

getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
googleSignup(idToken: string) {
  return this.http.post<{ token: string }>('/api/v1/users/google-signup', { idToken });
}

 register(user: User): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, user,{ responseType: 'text' });
  }
getUserByEmail(email: string): Observable<User> {
  return this.http.get<User>(`${this.BASE_URL}/email/${email}`);
}

  constructor(private http: HttpClient, private router: Router) {}

 

  private tokenKey = 'auth_token';
private headers = new HttpHeaders({
  'Content-Type': 'application/json'
});
private readonly API_URL = '/api/v1/users'; // Port de votre backend

login(email: string, password: string) {
  return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
    tap(response => {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_email', email); // Stocke l'email
    })
  );
}

 

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
 
getCurrentUserPhoto(): string | null {
  return localStorage.getItem('user_photo');
}
    storeUserPhoto(photoUrl: string): void {
  localStorage.setItem('user_photo', photoUrl);
}

getphoto(email: string, password: string) {
  return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
    tap(response => {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_email', email);
      
      // Fetch user details including photo after login
      this.getUserByEmail(email).subscribe(user => {
        if (user.photo) {
          this.storeUserPhoto(user.photo);
        }
      });
    })
  );
}

  


 

 setToken(token: string): void {
  localStorage.setItem(this.tokenKey, token); // tokenKey = 'auth_token'
}



 /*storeToken(token: string) {
    localStorage.setItem('auth-token', token);
  }*/
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}/list/${id}`);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.BASE_URL}/list/update/${id}`, user);
  }

/*  uploadUserPhoto(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.BASE_URL}/upload-image/${id}`, formData);
  }*/

  uploadUserPhoto(id: number, file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post(`${this.BASE_URL}/upload-image/${id}`, formData, {
    responseType: 'text'
  });
}

}
