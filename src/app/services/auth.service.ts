import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, AuthRequest, LoginRequest } from '../models/user';
import { Router } from '@angular/router';
import { response } from 'express';
import { mock } from 'node:test';
import { jwtDecode } from 'jwt-decode';
import { HttpParams } from '@angular/common/http';

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
    if (storedUser && storedUser !== 'undefined') {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }

    console.log('Stored user:', storedUser); // Log retrieval from localStorage

    this.initMockData(); // load saved mock users from localStorage
  }

  // Get current user value without subscribing
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Login
  login(credentials: LoginRequest): Observable<User> {
    const { email, password } = credentials;

    if (environment.useMockData) {
      return this.mockLogin(credentials);
    } else {
      const params = new HttpParams()
        .set('email', email)
        .set('password', password);

      const loginUrl = `${this.baseUrl}/login`;

      console.log('Sending login request with HttpParams:', params.toString());

      return this.http
        .post(loginUrl, null, {
          params,
          responseType: 'text',
        }) // null body, token returned as plain text
        .pipe(
          map((token: string) => {
            localStorage.setItem('token', token);

            const payload: any = jwtDecode(token);

            const user: User = {
              id: payload.id ?? 0,
              username: payload.username ?? '',
              email: payload.email ?? payload.sub,
              name: payload.name ?? payload.name,
              lastName: payload.lastName || '',
              status: payload.status ?? true,
            };

            console.log('Decoded payload:', payload);

            console.log('User to be stored:', user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            return user;
          }),
          catchError((error) => {
            console.error('Login failed with API', error);
            return throwError(
              () => new Error('Login failed. Please check your credentials.')
            );
          })
        );
    }
  }

  // Register
  register(userData: AuthRequest): Observable<User> {
    console.log('Using mock data?', environment.useMockData);

    if (environment.useMockData) {
      return this.mockRegister(userData);
    } else {
      // To include status in the request
      const registerData = {
        ...userData,
        status: userData.status !== undefined ? userData.status : true, // Include status with default true if not provided
      };

      return this.http
        .post<User>(`${this.baseUrl}/register`, registerData)
        .pipe(
          // After registration, Login to obtain token
          switchMap(() =>
            this.login({ email: userData.email, password: userData.password })
          ),
          catchError((error) => {
            console.error('Registration error wtih API', error);

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

    console.log('Stored token deleted.');

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
      status: userData.status !== undefined ? userData.status : true, //status field default true
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
