import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Reclamation {
  id?: number;
  senderUserEmail: string;
  targetUserEmail: string;
  reason: string;
  details: string;
  createdAt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

private baseUrl = "/api/v1/reclamations";
;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.baseUrl);
  }

  create(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.baseUrl, reclamation);
  }

  update(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}`, reclamation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }



  

generateDescription(prompt: string) {
  return this.http.post<string>(
    '/api/v1/reclamations/generate-description',
    { prompt },
    { responseType: 'text' as 'json' } // Pour éviter une erreur de typage si le backend renvoie une string brute
  );
}
}
