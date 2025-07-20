import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-user-profile-component',
  templateUrl: './user-profile-component.component.html',
  styleUrls: ['./user-profile-component.component.scss']
})
export class UserProfileComponentComponent implements OnInit{
userId!: number;
  user: User = {} as User;
  selectedFile?: File;
  successMessage = '';
  errorMessage = '';

  constructor(private userService: AuthServiceService) {}

ngOnInit(): void {
   const email = this.userService.getUserEmail();

  if (email) {
    this.userService.getUserByEmail(email).subscribe({
      next: (data) => {
        this.user = data;
        this.userId = data.id !== undefined ? data.id : 0; // 🔥 essentiel, fallback to 0 if undefined
      },
      error: () => this.errorMessage = "Erreur de chargement du profil via email"
    });
  } else {
    this.errorMessage = "Utilisateur non connecté (email non trouvé)";
  }
}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    if (this.selectedFile) {
      this.userService.uploadUserPhoto(this.userId, this.selectedFile).subscribe({
        next: (filename) => {
          this.user.photo = filename;
          this.successMessage = "Photo mise à jour avec succès";
        },
      });
    }
  }

  saveProfile(): void {
      console.log('User to update:', this.user); // 🐞 debug

    this.userService.updateUser(this.userId, this.user).subscribe({
      next: () => this.successMessage = "Profil mis à jour avec succès",
       error: (err) => {
      console.error(err); // Affiche l'erreur exacte
      this.errorMessage = "Erreur lors de la mise à jour";
    }
  });
  }
}
