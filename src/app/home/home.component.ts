import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements  OnInit {
  private authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.getPayload().subscribe(data => {
      console.log(data);
    });
  }
}
