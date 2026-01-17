import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { User } from '../models/user.model';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-filter',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.scss'
})
export class UsersFilterComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  @Output() userSelected = new EventEmitter<User>();

  private users: User[] = [];
  protected filteredUsers: User[] = [];
  protected searchTerm: string = '';
  protected selectedUserId: number | null = null;

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filterList();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allUsers']) {
      this.filterList();
    }
  }

  filterList() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u => 
      u.username.toLowerCase().includes(lowerTerm) || 
      u.email.toLowerCase().includes(lowerTerm)
    );
  }

  selectUser(user: User) {
    this.selectedUserId = user.id;
    this.userSelected.emit(user);
  }
}
