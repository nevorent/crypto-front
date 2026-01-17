import { Component } from '@angular/core';
import { UsersFilterComponent } from '../users-filter/users-filter.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UsersFilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
