import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface NotificationRequest {
  toEmail: string;
  subject: string;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = '/api/v1/notifications'; // Assure-toi que ça pointe vers ton gateway ou directement ton microservice

  constructor(private http: HttpClient) {}

  sendNotification(request: NotificationRequest): Observable<string> {
    return this.http.post(this.apiUrl, request, { responseType: 'text' });
  }
}
