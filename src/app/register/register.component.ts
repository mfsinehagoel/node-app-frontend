import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent implements OnInit {
  error = '';
  success = '';
  loading = false;
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
	this.form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['employee']
  });
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    if (this.form.invalid) {
      this.error = 'Please fix the errors in the form.';
      return;
    }
    this.loading = true;
    this.auth.register(this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = 'Registered successfully. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 900);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
