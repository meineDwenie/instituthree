import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Permission } from '../models/permission';
import { MockPermissionsService } from './mock-permissions.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private baseUrl: string;
  private useMockData: boolean;

  constructor(
    private http: HttpClient,
    private mockService: MockPermissionsService
  ) {
    // Set up environment configuration
    this.baseUrl = environment.apiUrl;
    this.useMockData = environment.useMockData;

    console.log(
      `RolesService initialized with ${
        this.useMockData ? 'MOCK' : 'REAL'
      } data source`
    );
  }

  getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    //console.log('Token in localStorage:', token);

    if (!token) return null;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllPermissions(): Observable<Permission[]> {
    if (this.useMockData) {
      return this.mockService.getAllPermissions();
    }

    const headers = this.getAuthHeaders();
    if (!headers)
      return throwError(() => new Error('Authentication token not found.'));

    return this.http
      .get<Permission[]>(`${this.baseUrl}/permissions`, { headers })
      .pipe(
        tap((permissions) => console.log('Permissions fetched:', permissions)),
        catchError((error) => this.handleError('getAllPermissions', error))
      );
  }

  getPermissionById(id: number): Observable<Permission | undefined> {
    if (this.useMockData) {
      return this.mockService.getPermissionById(id);
    }

    const headers = this.getAuthHeaders();
    if (!headers)
      return throwError(() => new Error('Authentication token not found.'));

    return this.http
      .get<Permission>(`${this.baseUrl}/permissions/${id}`, { headers })
      .pipe(
        tap((permission) => console.log('Permission fetched:', permission)),
        catchError((error) => this.handleError('getPermissionById', error))
      );
  }

  /*
  createPermission(permission: Permission): Observable<Permission> {
    if (this.useMockData) {
      return this.mockService.createPermission(permission);
    }

    const headers = this.getAuthHeaders();
    if (!headers)
      return throwError(() => new Error('Authentication token not found.'));

    return this.http
      .post<Permission>(`${this.baseUrl}/permissions`, permission, { headers })
      .pipe(
        tap((created) => console.log('Permission created:', created)),
        catchError((error) => this.handleError('createPermission', error))
      );
  }

  updatePermission(permission: Permission): Observable<Permission> {
    if (this.useMockData) {
      this.mockService.updatePermission(permission);
    }

    const headers = this.getAuthHeaders();
    if (!headers)
      return throwError(() => new Error('Authentication token not found.'));

    return this.http
      .put<Permission>(
        `${this.baseUrl}/permissions/${permission.id}`,
        permission,
        { headers }
      )
      .pipe(
        tap(() => console.log(`Permission updated: ${permission.id}`)),
        catchError((error) => this.handleError('updatePermission', error))
      );
  }

  deletePermission(id: number): Observable<any> {
    if (this.useMockData) {
      this.mockService.deletePermission(id);
    }

    const headers = this.getAuthHeaders();
    if (!headers)
      return throwError(() => new Error('Authentication token not found.'));

    return this.http
      .delete(`${this.baseUrl}/permissions/${id}`, { headers })
      .pipe(
        tap(() => console.log(`Permission deleted: ${id}`)),
        catchError((error) => this.handleError('deletePermission', error))
      );
  }
      */

  private handleError(
    operation: string,
    error: HttpErrorResponse
  ): Observable<never> {
    console.error(`${operation} failed:`, error.message);
    return throwError(
      () => new Error(`Error in ${operation}: ${error.message}`)
    );
  }
}
