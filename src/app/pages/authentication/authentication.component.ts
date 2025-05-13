import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../shared/login-form/login-form.component';
import { RegisterFormComponent } from '../../shared/register-form/register-form.component';
import { HeaderNavComponent } from '../../shared/header-nav/header-nav.component';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    RegisterFormComponent,
    HeaderNavComponent,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
})
export class AuthenticationComponent {
  isRegisterMode = false;

  switchToRegister() {
    this.isRegisterMode = true;
  }

  switchToLogin() {
    this.isRegisterMode = false;
  }
}
