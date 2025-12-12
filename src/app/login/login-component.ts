import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
  standalone: true,
})
export class LoginComponent implements OnInit {
  error = '';
  loading = false;
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Please enter email and password.';
      return;
    }
    this.loading = true;
    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      },
    });
  }
}
