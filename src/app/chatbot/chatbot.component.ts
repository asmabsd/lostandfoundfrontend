import { Component } from '@angular/core';
import { GeminiService } from 'src/app/services/gemini.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})



export class ChatbotComponent { 
  chatOpen = false;
  userMessage = '';
  messages: { from: string, message: string }[] = [];

  constructor(private geminiService: GeminiService) {
    this.geminiService.getMessageHistory().subscribe(data => {
      if (data) this.messages.push(data);
    });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;
    await this.geminiService.generateText(this.userMessage);
    this.userMessage = '';
  }
}