import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environment';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
  standalone: true
})
export class DashboardComponent implements OnInit {
  user: any;
  profile: any;

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = this.auth.getToken();
    if (token) {
      this.http
        .get(`${environment.apiUrl}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (res: any) => (this.profile = res),
          error: (err: Error) => console.warn('profile fetch failed', err),
        });
    }
  }

  logout() {
    this.auth.logout();
    location.href = '/login';
  }
}
