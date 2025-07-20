import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

class GoogleGenerativeAI {
  constructor(private apiKey: string) {
    console.log('GoogleGenerativeAI initialized with API key:', apiKey);
  }

}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;
  private messageHistory: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.generativeAI = new GoogleGenerativeAI('YOUR_API_KEY');
  }
}