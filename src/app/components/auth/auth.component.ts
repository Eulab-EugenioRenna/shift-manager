import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    MessagesModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
    ])
  ],
  providers: [MessagesService]
})
export class AuthComponent  {
  isSignUp: boolean = false;
  loading: boolean = false;

  loginForm = {
    email: '',
    password: ''
  };

  signupForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  };

  constructor(private message: MessagesService) { }


  onLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.showError('Inserisci email e password per accedere');
      return;
    }

    this.loading = true;

    // Simulazione chiamata API
    setTimeout(() => {
      this.loading = false;

      // Qui inserisci la logica di autenticazione reale
      if (this.loginForm.email === 'demo@example.com' && this.loginForm.password === 'password') {
        this.showSuccess('Accesso effettuato con successo');
        // Redirect all'app
      } else {
        this.showError('Credenziali non valide');
      }
    }, 1500);
  }

  onSignup(): void {
    // Validazione
    if (!this.signupForm.firstName || !this.signupForm.lastName || !this.signupForm.email) {
      this.showError('Compila tutti i campi richiesti');
      return;
    }

    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.showError('Le password non corrispondono');
      return;
    }

    if (!this.signupForm.termsAccepted) {
      this.showError('Devi accettare i termini di servizio');
      return;
    }

    this.loading = true;

    // Simulazione chiamata API
    setTimeout(() => {
      this.loading = false;
      this.showSuccess('Account creato con successo! Effettua il login per continuare.');
      this.isSignUp = false;
      this.resetForms();
    }, 1500);
  }

  private showSuccess(detail: string): void {

    this.message.info(detail);
  }

  private showError(detail: string): void {
    this.message.error(detail, new Error('Errore'));
  }

  private resetForms(): void {
    this.loginForm = {
      email: '',
      password: ''
    };

    this.signupForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
    };
  }
}
