import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from './item.service';
export type Status = 'FOUND' | 'LOST';
@Injectable({
  providedIn: 'root'
})
export class MatchingService {
   private baseUrl = '/api/v1/matchings'; // Adapté à ton backend
  private userUrl = '/api/v1/users';     // Pour vérifier premium

  constructor(private http: HttpClient) {}




  


  private itemUrl = '/api/v1/items';


  isUserPremium(email: string): Observable<boolean> {
return this.http.get<boolean>(`/api/v1/users/premium?email=${encodeURIComponent(email)}`)
  }

  getMatchingItems(itemId: number, isPremium: boolean): Observable<Item[]> {
    const endpoint = isPremium ? `${this.baseUrl}/ai/${itemId}` : `${this.baseUrl}/basic/${itemId}`;
    return this.http.get<Item[]>(endpoint);
  }

  getUserLostItems(email: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.itemUrl}?email=${email}&status=LOST`);
  }

}
