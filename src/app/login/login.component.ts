import { Component, inject } from '@angular/core';
import { MatCardHeader, MatCardContent, MatCardActions, MatCard } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../services/auth/auth.service';
import { LoginUser } from '../models/login-user.model';
import { FormsModule } from '@angular/forms';
import { SpinnerService } from '../services/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader, 
    MatCardContent,
    MatCardActions,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private spinnerService = inject(SpinnerService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  protected loginUser: LoginUser = {
    username: '',
    password: ''
  }

  public login() {
    this.spinnerService.show();
    this.authService.logInUser(this.loginUser).subscribe({
      next: (response) => {
        this.spinnerService.hide();
        this.snackBar.open('Log-In successful!', 'Dismiss', { duration: 3000 })
          .afterDismissed()
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      },
      error: (error) => {
        console.error('Log-in failed', error);
        this.spinnerService.hide();
        this.snackBar.open('Log-in failed. Please try again.', 'Dismiss', { duration: 3000 });
      }
    });
  }
}
