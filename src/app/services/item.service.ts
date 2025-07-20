import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Item {
  id?: number;
  type: string;
  description: string;
  location: string;
  date: string;
  status: 'LOST' | 'FOUND' | 'CLAIMED' | 'RETURNED';

  photo: string;
  useremail: String; 
}
@Injectable({
  providedIn: 'root'
})
export class ItemService {





uploadImage(itemId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/${itemId}/upload-image`, formData);
}




 private baseUrl = '/api/v1/items';
  constructor(private http: HttpClient) {}

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl);
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, item);
  }

  updateItem(id: number, item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }}
