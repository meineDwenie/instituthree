import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit {
  @Output() switchToLogin = new EventEmitter<void>();
  registerForm: FormGroup;
  registrationError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    // Initialize any required data
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }

  onRegister(): void {
    this.registrationError = null;

    if (this.registerForm.valid) {
      const { username, email, password, name, lastName } =
        this.registerForm.value;

      const userData = {
        username,
        email,
        password,
        name,
        lastName,
        status: true, // Setting status to true by default for new registrations
      };

      this.authService.register(userData).subscribe({
        next: (user) => {
          console.log('Registration successful:', user);
          // Navigate to user-management page after successful registration
          this.router.navigate(['/user-management']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.registrationError =
            error.message || 'Registration failed. Please try again.';
        },
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      console.log('Form is invalid');
    }
  }
}
