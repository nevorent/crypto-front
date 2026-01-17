import { Component, inject } from '@angular/core';
import { MatCardHeader, MatCardContent, MatCardActions, MatCard } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { RegisterUser } from '../models/register-user.model';
import { AuthService } from '../services/auth/auth.service';
import { SpinnerService } from '../services/spinner/spinner.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private spinnerService = inject(SpinnerService);

  protected registerUser: RegisterUser = {
    email: '',
    username: '',
    password: ''
  }

  public register() {
    this.spinnerService.show();
    this.authService.registerUser(this.registerUser).subscribe(response => {
      console.log('Registration successful', response);
      this.spinnerService.hide();
    });
  }
}
