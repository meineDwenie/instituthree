import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Role } from '../models/role';
import { environment } from '../../environments/environment';
import { MockRolesService } from './mock-roles.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private baseUrl: string;
  private useMockData: boolean;

  constructor(private http: HttpClient, private mockService: MockRolesService) {
    // Set up the service based on environment configuration
    this.baseUrl = environment.apiUrl;
    this.useMockData = environment.useMockData;

    console.log(
      `RolesService initialized with ${
        this.useMockData ? 'MOCK' : 'REAL'
      } data source`
    );
  }

  // Get all roles
  getRoles(): Observable<Role[]> {
    if (this.useMockData) {
      console.log('Using mock data for getRoles()');
      return this.mockService.getRoles();
    }

    return this.http.get<Role[]>(`${this.baseUrl}/roles`).pipe(
      tap((roles) => console.log('Roles fetched:', roles)),
      catchError(this.handleError<Role[]>('getRoles', []))
    );
  }

  // Get a single role by ID
  getRoleById(id: number): Observable<Role> {
    if (this.useMockData) {
      return this.mockService.getRoleById(id);
    }

    return this.http.get<Role>(`${this.baseUrl}/roles/${id}`).pipe(
      tap((role) => console.log(`Role fetched with id=${id}`)),
      catchError(this.handleError<Role>('getRoleById'))
    );
  }

  // Create a new role
  createRole(role: Role): Observable<Role> {
    if (this.useMockData) {
      return this.mockService.createRole(role);
    }

    return this.http.post<Role>(`${this.baseUrl}/roles`, role).pipe(
      tap((newRole) => console.log('Role created:', newRole)),
      catchError(this.handleError<Role>('createRole'))
    );
  }

  // Update an existing role
  updateRole(role: Role): Observable<Role> {
    if (this.useMockData) {
      return this.mockService.updateRole(role);
    }

    return this.http.put<Role>(`${this.baseUrl}/roles/${role.id}`, role).pipe(
      tap((_) => console.log(`Role updated with id = ${role.id}`)),
      catchError(this.handleError<Role>('updateRole'))
    );
  }

  // Delete a role
  deleteRole(id: number): Observable<any> {
    if (this.useMockData) {
      return this.mockService.deleteRole(id);
    }

    return this.http.delete(`${this.baseUrl}/roles/${id}`).pipe(
      tap((_) => console.log(`Role deleted with id=${id}`)),
      catchError(this.handleError<any>('deleteRole'))
    );
  }

  // Get permissions for a specific role
  getRolePermissions(roleId: number): Observable<string[]> {
    if (this.useMockData) {
      return this.mockService.getRolePermissions(roleId);
    }

    return this.http
      .get<string[]>(`${this.baseUrl}/roles/${roleId}/permissions`)
      .pipe(
        tap((permissions) =>
          console.log(`Permissions fetched for role id=${roleId}`, permissions)
        ),
        catchError(this.handleError<string[]>('getRolePermissions', []))
      );
  }

  // Update permissions for a role
  updateRolePermissions(
    roleId: number,
    permissions: string[]
  ): Observable<any> {
    if (this.useMockData) {
      return this.mockService.updateRolePermissions(roleId, permissions);
    }

    return this.http
      .put(`${this.baseUrl}/roles/${roleId}/permissions`, { permissions })
      .pipe(
        tap((_) => console.log(`Permissions updated for role id=${roleId}`)),
        catchError(this.handleError<any>('updateRolePermissions'))
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
