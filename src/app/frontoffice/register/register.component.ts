import { SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login'; // <-- ajouter ici
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {  NgZone, OnInit } from '@angular/core';

declare const google: any; // déclaration pour TypeScript
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

 registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage: string | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
        private socialAuthService: SocialAuthService,
        private ngZone: NgZone

  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        cin: ['', Validators.required],
        premium: [false],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }
  waitForGoogle(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if ((window as any).google && (window as any).google.accounts) {
        resolve();
      } else {
        setTimeout(check, 100); // réessaie jusqu’à ce que le script soit chargé
      }
    };
    check();
  });
}


ngOnInit(): void {
  this.waitForGoogle().then(() => {
    google.accounts.id.initialize({
      client_id: '447815519820-p22sjoklsfup367rrm9hqktrlj4vl6ap.apps.googleusercontent.com', // remplace ici
      callback: (response: any) => this.handleCredentialResponse(response),
      auto_select: false,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: false
    });

    google.accounts.id.prompt((notification: any) => {
      if (notification.getSkippedReason() === 'tap_outside') {
        google.accounts.id.prompt();
      }
    });
  });
}


handleCredentialResponse(response: any) {
  const idToken = response.credential;
  if (idToken) {
    this.authService.googleSignup(idToken).subscribe({
      next: (res: any) => {
        this.successMessage = '✅ Connexion Google réussie !';
        localStorage.setItem('token', res.token);
        this.ngZone.run(() => this.router.navigate(['/frontoffice/start']));
      },
      error: (err) => {
        this.errorMessage = '❌ Erreur Google : ' + err?.error?.message || 'Erreur inconnue';
      }
    });
  }
}



  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
this.successMessage = '✅ Account created successfully! Redirecting...';

    const formValue = this.registerForm.value;

    const newUser: User = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      score: 0, // Initial score
      password: formValue.password,
      role: 'USER',
      cin: formValue.cin,
      premium: false
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        this.successMessage = '✅ Account created successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/frontoffice/login']), 2000);
      }
    });
  }

  goToLogin(): void {
setTimeout(() => this.router.navigate(['/frontoffice/login']), 2000);
  }



signUpWithGoogle(): void {
    this.errorMessage = '';
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (socialUser: SocialUser) => {
        const idToken = socialUser.idToken;

        // Appel backend pour inscription avec token Google
        this.authService.googleSignup(idToken).subscribe({
          next: (res: any) => {
            this.successMessage = '✅ Inscription Google réussie ! Redirection...';
            // Par ex. enregistrer token JWT dans localStorage
            localStorage.setItem('token', res.token);
            setTimeout(() => this.router.navigate(['/frontoffice/start']), 2000);
          },
          error: (err) => {
            this.errorMessage = '❌ Erreur inscription Google : ' + err.error || err.message;
          }
        });
      },
      (err) => {
        this.errorMessage = '❌ Erreur connexion Google : ' + err;
      }
    );
  }


  handleGoogleSignIn() {
    // Optionnel, si tu veux déclencher prompt manuellement
    google.accounts.id.prompt();
  }

  


}