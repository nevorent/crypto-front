import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements  OnInit {
  private authService = inject(AuthService);
  ngOnInit(): void {
  }
}
