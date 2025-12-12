import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
//   private tokenKey = 'auth_token';
//   constructor(private http: HttpClient) {}

//   register(payload: any) {
//     return this.http
//       .post<{ token: string }>(`${environment.apiUrl}/register`, payload)
//       .pipe(tap((res) => this.setToken(res.token)));
//   }

//   login(payload: any) {
//     return this.http
//       .post<{ token: string }>(`${environment.apiUrl}/login`, payload)
//       .pipe(tap((res) => this.setToken(res.token)));
//   }

//   setToken(token: string) {
//     localStorage.setItem(this.tokenKey, token);
//   }
//   getToken() {
//     return localStorage.getItem(this.tokenKey);
//   }
//   logout() {
//     localStorage.removeItem(this.tokenKey);
//   }
//   isLoggedIn() {
//     return !!this.getToken();
//   }


  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(payload: { name: string; email: string; password: string; role?: string }) {
    return this.http.post(`${environment.apiUrl}/register`, payload);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<{ token: string; user: any }>(`${environment.apiUrl}/login`, payload)
      .pipe(tap(resp => {
        if (resp && resp.token) {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('user', JSON.stringify(resp.user));
          this.userSubject.next(resp.user);
        }
      }));
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
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}
