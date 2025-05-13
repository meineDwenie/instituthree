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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../services/register.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private http: HttpClient
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
    this.onRegister();
    throw new Error('Method not implemented.');
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
    if (this.registerForm.valid) {
      const { username, email, password, name, lastName } =
        this.registerForm.value;

      const requestBody = {
        username,
        password,
        email,
        name,
        lastName,
      };

      console.log('Register with:', username, email, password, name, lastName);
      // Register Action API call
      this.http
        .post('https://registerapp.up.railway.app/api/register', requestBody)
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            // navigate to user-management page (or create register success message))
            this.router.navigate(['/user-management']);
          },
          error: (error) => {
            console.error('Registration failed:', error);
            // Handle registration error (e.g., show error message)
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
