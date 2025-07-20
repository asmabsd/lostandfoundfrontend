import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
 userEmail: string;

  constructor() {
    this.userEmail = localStorage.getItem('user_email') || 'Invité';
  }
}
