import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, AuthRequest, AuthResponse } from '../models/user';
import { Router } from '@angular/router';
import { response } from 'express';
import { mock } from 'node:test';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private mockUsers: User[] = [];
  private mockTokens: { [userId: number]: string } = {};

  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {
    // Checl localStorage for existing user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // Get current user value without subscribing
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Login
  login(credentials: AuthRequest): Observable<User> {
    if (environment.useMockData) {
      return this.mockLogin(credentials);
    } else {
      return this.http
        .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
        .pipe(
          map((response) => {
            // Store token in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            return response.user;
          }),
          catchError((error) => {
            console.error('Login error:', error);
            return throwError(
              () => new Error('Login failed. Please check your credentials.')
            );
          })
        );
    }
  }

  // Register
  register(userData: AuthRequest): Observable<User> {
    if (environment.useMockData) {
      return this.mockRegister(userData);
    } else {
      return this.http
        .post<AuthResponse>(`${this.baseUrl}/register`, userData)
        .pipe(
          map((response) => {
            // Could auto log in user after resistration
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
            return response.user;
          }),
          catchError((error) => {
            console.error('Registration failed:', error);
            return throwError(
              () => new Error('Registration failed. Please try again.')
            );
          })
        );
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/authentaction']);
  }

  // Mock Authentication
  private mockLogin(credentials: AuthRequest): Observable<User> {
    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      return throwError(
        () => new Error('User not found. Please register first.')
      );
    }

    // Mock data only checking raw password
    const mockPasswords = JSON.parse(
      localStorage.getItem('mockPasswords') || '{}'
    );
    if (mockPasswords[user.id] !== credentials.password) {
      return throwError(() => new Error('Invalid password.'));
    }

    // Mock token generation
    const token = `mock-token-${Date.now()}`;
    this.mockTokens[user.id] = token;

    // Store token in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);

    return of(user);
  }

  private mockRegister(userData: AuthRequest): Observable<User> {
    // Check if email already exists
    if (this.mockUsers.some((u) => u.email === userData.email)) {
      return throwError(() => new Error('Email already registered.'));
    }

    // Check if username already exists
    if (
      userData.username &&
      this.mockUsers.some((u) => u.username === userData.username)
    ) {
      return throwError(() => new Error('Email already registered.'));
    }

    // Create new user with ID
    const newUser: User = {
      id: this.mockUsers.length + 1,
      username: userData.username || '',
      email: userData.email,
      name: userData.name || '',
      lastName: userData.lastName || '',
    };

    // Store password separately (in a real app, this would be hashed)
    // Again, this is ONLY for mock data demonstration - NEVER store passwords like this!
    const mockPasswords = JSON.parse(
      localStorage.getItem('mockPasswords') || '{}'
    );
    mockPasswords[newUser.id] = userData.password;
    localStorage.setItem('mockPasswords', JSON.stringify(mockPasswords));

    // Add user to mock database
    this.mockUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(this.mockUsers));

    // Mock token generation
    const token = `mock-token-${Date.now()}`;
    this.mockTokens[newUser.id] = token;

    // Store token in localStorage and update behavior subject
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);

    return of(newUser);
  }

  // Initialize mock data
  initMockData(): void {
    if (environment.useMockData) {
      const storedMockUsers = localStorage.getItem('mockUsers');
      if (storedMockUsers) {
        this.mockUsers = JSON.parse(storedMockUsers);
      }
    }
  }

  // Helper method to get the authentication token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
