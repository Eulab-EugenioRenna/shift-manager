import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessagesService } from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

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

  constructor(private message: MessagesService, private auth: AuthService,private router: Router) { }


  onLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.showError('Inserisci email e password per accedere');
      return;
    }
    this.loading = true;
    this.auth.signInPassword(this.loginForm.email, this.loginForm.password).then(() => {
      this.loading = false;
      this.showSuccess('Accesso effettuato con successo');
      this.router.navigate(['']);
    }
    ).catch((error) => {
      this.loading = false;
      this.showError('Errore durante l\'accesso');
    }
    );
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
    const user: User = {
      username: this.signupForm.email,
      email: this.signupForm.email,
      password: this.signupForm.password,
      passwordConfirm: this.signupForm.confirmPassword,
      first_name: this.signupForm.firstName,
      last_name: this.signupForm.lastName,
      role: 'volontario'
    };
    this.auth.register(user).then(() => {
      this.showSuccess('Registrazione effettuata con successo');
      this.resetForms();
    }).catch((error) => {

      this.showError('Errore durante la registrazione');
    }).finally(() => {
      this.loading = false;
      this.isSignUp = false;
    })
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
