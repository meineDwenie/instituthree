import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../shared/login-form/login-form.component';
import { RegisterFormComponent } from '../../shared/register-form/register-form.component';
import { HeaderNavComponent } from '../../shared/header-nav/header-nav.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    HeaderNavComponent,
    RegisterFormComponent,
  ],
  providers: [AuthService],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
})
export class AuthenticationComponent implements OnInit {
  isRegisterMode = false;

  constructor(public auth: AuthService) {
    // Initialize the AuthService
    //this.auth.isRegisterMode = false; // Default to login mode
  }

  ngOnInit(): void {
    // Ensure login mode is default whenever the component is loaded
    this.isRegisterMode = false;

    // Initialize mock data for authentication
    this.auth.initMockData();
  }

  switchToRegister() {
    this.isRegisterMode = true;
  }

  switchToLogin() {
    this.isRegisterMode = false;
  }
}
