import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
   user:User| null = null;
  
 userEmail: string;
  router: any;
  userPhoto: string|null = null;

  constructor(private route: Router, private authService: AuthServiceService) {
    this.userEmail = localStorage.getItem('user_email') || 'Invité';
  }

  ngOnInit() {
  const userEmail = localStorage.getItem('user_email');
  console.log('Email utilisateur :', userEmail); // Affiche dans la console

 
    // Get user email
    const email = this.authService.getUserEmail();
    if (email) {
      this.userEmail = email;
      
      // Get user photo from localStorage if available
      this.userPhoto = this.authService.getCurrentUserPhoto();
      
      // If photo not in localStorage, fetch it from API
      if (!this.userPhoto) {
        this.authService.getUserByEmail(email).subscribe(user => {
          if (user.photo) {
            this.userPhoto = user.photo;
            this.authService.storeUserPhoto(user.photo);
          }
        });
      }
        if (email) {
    this.authService.getUserByEmail(email).subscribe(user => {
      this.user = user; // utilisateur complet ici
      this.userEmail = user.email;
      this.userPhoto = typeof user.photo === 'string' ? user.photo : null;

      // Optionnel : stocker dans localStorage si tu veux le garder
      localStorage.setItem('user', JSON.stringify(user));
      if (typeof user.photo === 'string') {
        this.authService.storeUserPhoto(user.photo); // si besoin
      }
    });
  }
    }
  }








  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    
    // 2. Redirige vers la page d'accueil
  window.location.href = '/frontoffice/acceuil'; // Solution simpl      .then(() => {
        // 3. Recharge la page pour réinitialiser l'état
     
  }
}
