import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Get the current user from the auth service
    this.currentUser = this.authService.currentUserValue;

    // Subscribe to user changes
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';

    const firstInitial = this.currentUser.name
      ? this.currentUser.name.charAt(0).toUpperCase()
      : '';
    const lastInitial = this.currentUser.lastName
      ? this.currentUser.lastName.charAt(0).toUpperCase()
      : '';

    return firstInitial + lastInitial;
  }

  logout(): void {
    this.authService.logout();
    console.log('Logging out via user profile dropdown ...');

    this.router.navigate(['/authentication']).then((success) => {
      console.log('Navigation success?', success);
      location.reload(); // Brute-force reload — replaces the current view entirely
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/authentication']);
  }
}
