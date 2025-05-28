import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, of, tap, throwError } from 'rxjs';
import { CreateUserRequest, UserData } from '../models/userdata';
import { environment } from '../../environments/environment';
import { MockUsersService } from './mock-users.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string;
  private useMockData: boolean;

  constructor(private http: HttpClient, private mockService: MockUsersService) {
    // Service based on environment configuration
    this.baseUrl = environment.apiUrl;
    this.useMockData = environment.useMockData;

    console.log(
      `UsersService initialized with ${
        this.useMockData ? 'MOCK' : 'REAL'
      } data source`
    );
  }

  // Get all users
  getUsers(): Observable<UserData[]> {
    if (this.useMockData) {
      return this.mockService.getUsers();
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found');
      return throwError(
        () => new Error('Authentication token not found. Please login again.')
      );
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Making API request to:', `${this.baseUrl}/users`);
    console.log('With headers:', headers);

    return this.http.get<any[]>(`${this.baseUrl}/users`, { headers }).pipe(
      tap((users) => console.log('Raw users from API:', users)),
      map(
        (users) =>
          users.map((user) => ({
            id: user.id.toString(),
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: this.mapRole(user.username), // Map based on username or add role field to API
            status: user.status ? 'Active' : 'Pending',
            photoUrl: user.photoUrl || 'assets/images/user.png', // Use photoUrl from API if available
            originalRole: user.username,
          })) as UserData[]
      ),
      tap((mappedUsers) => console.log('Mapped Users:', mappedUsers)),
      catchError((error) => {
        console.error('getUsers failed:', error);
        if (error.status === 401) {
          // Token might be expired
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          return throwError(
            () => new Error('Authentication expired. Please login again.')
          );
        }
        return this.handleError<UserData[]>('getUsers', [])(error);
      })
    );
  }

  // Get a single user by ID
  getUserById(id: string): Observable<UserData> {
    if (this.useMockData) {
      return this.mockService.getUserById(id);
    }

    return this.http.get<UserData>(`${this.baseUrl}/users/${id}`).pipe(
      tap((user) => console.log(`User fetched with id=${id}`)),
      catchError(this.handleError<UserData>('getUserById'))
    );
  }

  // Create a new user
  createUser(user: UserData): Observable<UserData> {
    if (this.useMockData) {
      return this.mockService.createUser(user);
    }

    return this.http.post<UserData>(`${this.baseUrl}/users`, user).pipe(
      tap((newUser) => console.log('User created:', newUser)),
      catchError(this.handleError<UserData>('createUser'))
    );
  }

  createUserRequest(userReq: CreateUserRequest): Observable<any> {
    const token = localStorage.getItem('token'); // token from login localStorage

    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('Authentication token is missing.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.baseUrl}/users`, userReq, { headers }).pipe(
      tap((response) => console.log('User created:', response)),
      catchError(this.handleError('createUserRequest'))
    );
  }

  // Update an existing user
  updateUser(user: UserData): Observable<UserData> {
    if (this.useMockData) {
      return this.mockService.updateUser(user);
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('Authentication token is missing.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .put<UserData>(`${this.baseUrl}/users/${user.id}`, user, { headers })
      .pipe(
        tap(() => console.log(`User updated with id = ${user.id}`)),
        catchError(this.handleError<UserData>('updateUser'))
      );
  }

  updateUserRequest(
    userId: string,
    updateReq: CreateUserRequest
  ): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('Authentication token is missing.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .put(`${this.baseUrl}/users/${userId}`, updateReq, { headers })
      .pipe(
        tap(() =>
          console.log(
            `User updated successfully from updateUserRequest with id = ${userId}`
          )
        ),
        catchError(this.handleError('updateUserRequest'))
      );
  }

  deleteUser(id: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.deleteUser(id);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Authentication token is missing.'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers }).pipe(
      tap(() => console.log(`User deleted with id=${id}`)),
      catchError(this.handleError<any>('deleteUser'))
    );
  }

  // Toggle between mock and real API for testing purposes
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    console.log(`Switched to ${useMock ? 'MOCK' : 'REAL'} data source`);
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

  private mapRole(username: string): UserData['role'] {
    // Map based on username or implement your own logic
    switch (username?.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'usuario':
        return 'Usuario';
      default:
        return 'Usuario';
    }
  }
}
