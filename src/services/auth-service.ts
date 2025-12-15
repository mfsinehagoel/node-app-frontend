import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(payload: { name: string; email: string; password: string; role?: string }) {
    return this.http.post(`${environment.apiUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }) {
    return this.http
      .post<{ token: string; user: any }>(`${environment.apiUrl}/login`, payload)
      .pipe(
        tap((resp) => {
          if (resp && resp.token) {
            localStorage.setItem('token', resp.token);
            localStorage.setItem('user', JSON.stringify(resp.user));
            this.userSubject.next(resp.user);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
