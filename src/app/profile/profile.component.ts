import { Component, inject, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { SpinnerService } from '../services/spinner/spinner.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatDividerModule,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private spinnerService = inject(SpinnerService);
  private user?: User;
  protected documents = [1, 2, 3, 4, 5, 6, 7];

  ngOnInit(): void {
    this.spinnerService.show();
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.userService.getUser().subscribe((user) => {
      console.log(user);
      this.user = user;
      this.spinnerService.hide();
    });
  }

  public get username() {
    return this.user?.username;
  }

  public get email() {
    return this.user?.email;
  }

  public get isActive() {
    return this.user?.isActive;
  }

  public get createdAt() {
    return this.user?.createdAt;
  }
}
