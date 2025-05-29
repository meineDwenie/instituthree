import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
  isSmallScreen = false;

  constructor(
    public auth: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {
    // Initialize the AuthService
    //this.auth.isRegisterMode = false; // Default to login mode
  }

  ngOnInit(): void {
    // Initialize mock data for authentication
    this.auth.initMockData();

    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;

        // Force default to login on smaller screens
        if (this.isSmallScreen) {
          this.isRegisterMode = false;
        }
      });
  }

  switchToRegister() {
    this.isRegisterMode = true;
  }

  switchToLogin() {
    this.isRegisterMode = false;
  }
}
