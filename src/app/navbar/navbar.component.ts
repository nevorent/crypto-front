import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { SpinnerService } from '../services/spinner/spinner.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  protected userService = inject(UserService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public logOut() {
    this.authService.logOut();
    this.snackBar.open('Log-Out successful!', 'Dismiss', { duration: 3000 })
      .afterDismissed()
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
