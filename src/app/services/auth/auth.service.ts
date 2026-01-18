import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterUser } from '../../models/register-user.model';
import { map, tap } from 'rxjs';
import { RegisterResponse } from '../../models/register-response.model';
import { User } from '../../models/user.model';
import { LoginUser } from '../../models/login-user.model';
import { LoginResponse } from '../../models/login-response.model';
import { ActionEnum } from '../action-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private commonServicePath = ActionEnum.Authentication;
  private specificServicePath = '';
  constructor() { }

  public registerUser(user: RegisterUser) {
    this.specificServicePath = 'register';
    const body = JSON.stringify(user);

    return this.http.post<RegisterResponse>(`${this.commonServicePath}/${this.specificServicePath}`, body).pipe(
      tap((response) => {
        if (response.pki_identity) {
          this.downloadFile(response.pki_identity.private_key, 'private_key.pem');
        }
      }),
      map((response): User => {
        return {
          id: response.id,
          username: response.username,
          email: response.email,
          isActive: response.is_active,
          createdAt: response.created_at
        };
      })
    );
  }

  public logInUser(user: LoginUser) {
    this.specificServicePath = 'login';
    const body = new HttpParams()
      .set('username', user.username) 
      .set('password', user.password);

    return this.http.post<LoginResponse>(`${this.commonServicePath}/${this.specificServicePath}`, body).pipe(
      tap((response) => {
        if (response.access_token && response.token_type) {
          this.saveCookie(response.access_token, response.token_type);
        }
      }),
      map((response) => {
        return true; 
      })
    );
  }

  public logOut() {
    this.deleteCookie('access_token');
    this.deleteCookie('token_type');
  }

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    
    window.URL.revokeObjectURL(url);
  }

  private saveCookie(accessToken: string, tokenType: string) {
    const path = "path=/";
    const sameSite = "SameSite=Strict";
    const secure = "Secure";

    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    const expires = `expires=${d.toUTCString()}`;

    document.cookie = `access_token=${accessToken}; ${path}; ${expires}; ${secure}; ${sameSite}`;

    document.cookie = `token_type=${tokenType}; ${path}; ${expires}; ${secure}; ${sameSite}`;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}
  