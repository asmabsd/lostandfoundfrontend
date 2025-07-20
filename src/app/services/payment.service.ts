import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
export interface Payment {
  id?: number;
  useremail: string;
  amount: number;
  premium: boolean;
  method?: string;
  paymentDate?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root'
})



export class PaymentService {

 private baseUrl = '/api/v1/payments'; // ajuste selon ton backend
 private baseUrl1 = '/api/v1/users'; // ajuste selon ton backend

  constructor(private http: HttpClient) { }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, payment);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`/api/v1/users/${email}`);
  }
isUserPremium(email: string): Observable<boolean> {
  return this.http.get<boolean>(`/api/v1/users/premium?email=${email}`);
}

 updatePremiumStatus(email: string, isPremium: boolean): Observable<any> {
const url = `/api/v1/users/premium/${encodeURIComponent(email)}`;
    const body = { premium: isPremium };

    return this.http.put(url, body); // ✅ PUT vers Spring Boot
  }

}
