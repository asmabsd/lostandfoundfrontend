import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { MatchingComponent } from '../matching/matching.component';
import { Payment, PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent  implements OnInit {

  userEmail: string = '';
  userPremium: boolean | undefined ;
  showForm: boolean = false;
  message: string = '';
method: string = 'Credit Card'; // Valeur par défaut
isSubmitting: boolean = false;

  amount: number = 10;
  name: string = '';
  email: string = '';

  constructor(private paymentService: PaymentService,private authentiserv:AuthServiceService) {}

  ngOnInit(): void {
    const email = localStorage.getItem('user_email');
    if (email) {
      this.userEmail = email;
      this.email = email;
      this.loadUserPremium(email);
    } else {
      this.message = 'Utilisateur non connecté.';
    }
  }

  setPaymentMethod(method: string) {
  this.method = method;
}
loadUserPremium(email: string) {
  this.authentiserv.getUserByEmail(email).subscribe({
    next: (user) => {
      console.log('User premium status:', user.premium);
      this.userPremium = user.premium;
      this.showForm = !this.userPremium;
      if (this.userPremium) {
        this.message = "Vous êtes déjà inscrit au plan premium. Voulez-vous arrêter l'abonnement ? Le reste de l'abonnement sera perdu.";
      } else {
        this.message = "Passez un abonnement premium en remplissant le formulaire ci-dessous.";
      }
    },
    error: () => {
      this.message = 'Erreur lors de la récupération du statut premium.';
      this.showForm = true;
    }
  });
}

 onSubmit() {
    this.isSubmitting = true;

  if (!this.amount || this.amount <= 0) {
    alert('Please select a valid subscription amount.');
    return;
  }
  if (!this.name) {
    alert('Please enter your full name.');
    return;
  }

  // Créer l'objet payment
  const payment: Payment = {
    useremail: this.email,
    amount: this.amount,
    premium: true,
    method: this.method || "Credit Card", // Utilise la méthode sélectionnée
    success: true,
    paymentDate: new Date().toISOString()
  };

  // Appel au service pour créer le paiement
  this.paymentService.createPayment(payment).subscribe({
    next: (response) => {
      // Mise à jour du statut premium de l'utilisateur
      this.paymentService.updatePremiumStatus(this.email, true).subscribe({
        next: (user: any) => {
          // Mise à jour des propriétés du composant
          this.userPremium = true;
          this.showForm = false;
          this.message = 'Thank you! Your premium subscription is now activated.';
              this.isSubmitting = false;

          // Stockage en localStorage si nécessaire
          localStorage.setItem('user_premium', 'true');
          
          // Affichage du message de succès
          setTimeout(() => {
            // Rechargement des données utilisateur si nécessaire
            this.loadUserPremium(this.email);
          }, 5000);
        },
        error: (error: any) => {
          console.error('Error updating user premium status:', error);
          this.message = 'Error updating your premium status. Please contact support.';
              this.isSubmitting = false;

        }
      });
    },
    error: (error) => {
      console.error('Payment submission error:', error);
      this.message = 'Error processing your payment. Please try again.';
    }
  });
}

  cancelSubscription() {
    this.paymentService.updatePremiumStatus(this.email, false).subscribe({
      next: () => {
        this.message = "Votre abonnement a été arrêté.";
        this.userPremium = false;
        this.showForm = true;
      },
      error: () => {
        this.message = "Erreur lors de l'arrêt de l'abonnement.";
      }
    });
  }

}