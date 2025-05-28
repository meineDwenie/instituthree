import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Output() switchToRegister = new EventEmitter<void>();
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSwitchToRegister() {
    this.switchToRegister.emit();
  }

  onLogin(): void {
    this.loginError = null;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      const credentials = {
        email,
        password,
      };

      this.authService.login(credentials).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          // Navigate to user-management page after successful login
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate(['/user-management']);
            });
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginError =
            error.message || 'Login failed. Please check your credentials.';
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
