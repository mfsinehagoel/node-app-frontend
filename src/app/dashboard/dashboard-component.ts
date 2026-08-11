import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environment';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  user: any;
  profile: any;
  employees: any[] = [];
  error = '';
  loading = true;

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = this.auth.getToken();

    if (!token) {
      this.error = 'Unauthorized. Please login again.';
      this.loading = false;
      return;
    }

    this.http
      .get(`${environment.apiUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res: any) => {
          this.profile = res.profile;

          if (this.profile?.role === 'admin') {
            this.fetchAllUsers(token);
          } else {
            this.loading = false;
          }
        },
        error: (err) => {
          this.error = 'Unable to load profile';
          this.loading = false;
          console.warn('profile fetch failed', err);
        },
      });
  }

  fetchAllUsers(token: string) {
    this.http
      .get(`${environment.apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res: any) => {
          this.employees = res;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Unable to load users list';
          this.loading = false;
          console.warn('users fetch failed', err);
        },
      });
  }

  logout() {
    this.auth.logout();
    location.href = '/login';
  }
}
