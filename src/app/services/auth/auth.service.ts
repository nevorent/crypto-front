import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterUser } from '../../models/register-user.model';
import { map, tap } from 'rxjs';
import { RegisterResponse } from '../../models/register-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private commonServicePath = 'auth/';
  private specificServicePath = '';
  constructor() { }

  registerUser(user: RegisterUser) {
    this.specificServicePath = 'register';
    const body = JSON.stringify(user);
    return this.http.post<RegisterResponse>(this.commonServicePath + this.specificServicePath, body).pipe(
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

  getPayload() {
    return this.http.get('');
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
}
  