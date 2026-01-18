import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { map } from 'rxjs';
import { UserResponse } from '../../models/user-response.model';
import { ActionEnum } from '../action-enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private commonServicePath = ActionEnum.User;
  private specificServicePath = '';

  constructor() { }

  public isLoggedIn(): boolean {
    return !!this.getCookie('access_token');
  }

  public getUser() {
    this.specificServicePath = 'me';
    return this.http.get<UserResponse>(`${this.commonServicePath}/${this.specificServicePath}`).pipe(
      map((response): User => {
        return {
          id: response.id,
          username: response.username,
          email: response.email,
          isActive: response.is_active,
          createdAt: response.created_at
        };
      }));
  }

  public getUsers() {
    this.specificServicePath = '';
    return this.http.get<UserResponse[]>(`${this.commonServicePath}/${this.specificServicePath}`).pipe(
      map((userResponses) => {
        return userResponses.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          isActive: user.is_active,
          createdAt: user.created_at
        }));
      })
    );
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }
}
