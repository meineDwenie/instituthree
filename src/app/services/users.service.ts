import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { UserData } from '../models/userdata';
import { environment } from '../../environments/environment';
import { MockUsersService } from './mock-users.service';

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
      console.log('Using mock data for getUsers()');
      return this.mockService.getUsers();
    }

    return this.http.get<UserData[]>(`${this.baseUrl}/users`).pipe(
      tap((users) => console.log('Users fetched:', users)),
      catchError(this.handleError<UserData[]>('getUsers', []))
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

  // Update an existing user
  updateUser(user: UserData): Observable<UserData> {
    if (this.useMockData) {
      return this.mockService.updateUser(user);
    }

    return this.http
      .put<UserData>(`${this.baseUrl}/users/${user.id}`, user)
      .pipe(
        tap((_) => console.log(`User updated with id = ${user.id}`)),
        catchError(this.handleError<UserData>('updateUser'))
      );
  }

  // Delete a user
  deleteUser(id: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.deleteUser(id);
    }

    return this.http.delete(`${this.baseUrl}/users/${id}`).pipe(
      tap((_) => console.log(`User deleted with id=${id}`)),
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
}
