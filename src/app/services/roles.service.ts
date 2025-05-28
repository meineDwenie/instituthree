import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Role } from '../models/role';
import { environment } from '../../environments/environment';
import { MockRolesService } from './mock-roles.service';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private baseUrl: string;
  private useMockData: boolean;

  constructor(private http: HttpClient, private mockService: MockRolesService) {
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

  // Get all roles
  getRoles(): Observable<Role[]> {
    if (this.useMockData) {
      console.log('Using mock data for getRoles()');
      return this.mockService.getRoles();
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    return this.http.get<Role[]>(`${this.baseUrl}/roles`, { headers }).pipe(
      tap((roles) => console.log('Roles fetched:', roles)),
      catchError(this.handleError<Role[]>('getRoles', []))
    );
  }

  // Get a single role by ID
  getRoleById(id: number): Observable<Role> {
    // validate ID
    if (!id || id <= 0) {
      console.error('Invalid role ID provided:', id);
      return throwError(() => new Error(`Invalid role ID: ${id}`));
    }

    if (this.useMockData) {
      return this.mockService.getRoleById(id);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      console.error('No authentication headers available');
      return throwError(() => new Error('Authentication token not found.'));
    }

    console.log('Calling getRoleById with headers:', headers);

    // {id} then role ID
    const url = `${this.baseUrl}/roles/${id}?id=${id}`;

    console.log('Making API call to:', url);
    console.log('Headers:', headers);

    return this.http.get<Role>(url, { headers }).pipe(
      tap((role) => {
        console.log('Role fetched successfully:', role);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Create a new role
  createRole(role: Role): Observable<Role> {
    if (this.useMockData) {
      return this.mockService.createRole(role);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    // Query string parameters
    const params = new URLSearchParams({
      id: '0',
      name: role.name,
      description: role.description,
    });

    const url = `${this.baseUrl}/roles?${params.toString()}`;
    //console.log('Create role URL:', url);

    return this.http.put<Role>(url, null, { headers }).pipe(
      tap((newRole) => console.log('Role created:', newRole)),
      catchError((error) => {
        console.error('Error creating role:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an existing role
  updateRole(role: Role): Observable<Role> {
    console.log('Updating role:', role);

    if (this.useMockData) {
      return this.mockService.updateRole(role);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    return this.http
      .put<Role>(`${this.baseUrl}/roles/${role.id}`, role, { headers })
      .pipe(
        tap((_) => console.log(`Role updated with id = ${role.id}`)),
        catchError((error) => {
          console.error('Error updating role:', error);
          return throwError(() => error);
        })
      );
  }

  // Delete a role
  deleteRole(id: number): Observable<any> {
    console.log('Deleting role with ID:', id);

    if (this.useMockData) {
      return this.mockService.deleteRole(id);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    const url = `${this.baseUrl}/roles/${id}?id=${id}`;
    console.log('DELETE URL:', url);

    return this.http.delete(url, { headers }).pipe(
      tap((_) => console.log(`Role deleted with id=${id}`)),
      catchError((error) => {
        console.error('Error deleting role:', error);
        return throwError(() => error);
      })
    );
  }

  // Get all permissions
  getAllPermissions(): Observable<Permission[]> {
    console.log('Getting all permissions');

    if (this.useMockData) {
      // Return mock permissions that match your API structure
      return of([
        { id: 1, name: 'READ', description: 'Permiso de lectura' },
        { id: 2, name: 'WRITE', description: 'Permiso de escritura' },
      ]);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    return this.http
      .get<Permission[]>(`${this.baseUrl}/permissions`, { headers })
      .pipe(
        tap((permissions) =>
          console.log('All permissions fetched:', permissions)
        ),
        catchError((error) => {
          console.error('Error getting all permissions:', error);
          return throwError(() => error);
        })
      );
  }

  // Get all roles with their permissions
  getAllRolesPermissions(): Observable<
    { role: string; permissions: string[] }[]
  > {
    if (this.useMockData) {
      return of([
        { role: 'Admin', permissions: ['READ', 'WRITE', 'DELETE'] },
        { role: 'User', permissions: ['READ'] },
      ]);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    return this.http
      .get<{ role: string; permissions: string[] }[]>(
        `${this.baseUrl}/roles/rolepermissions`,
        { headers }
      )
      .pipe(
        tap((data) => console.log('All roles permissions:', data)),
        catchError((error) => {
          console.error('Error getting all roles permissions:', error);
          return of([]); // Return empty array as fallback
        })
      );
  }

  // Get permission for specific role - FIXED: Using PUT method as per API docs
  getRolePermissions(roleId: number): Observable<string[]> {
    if (this.useMockData) {
      return this.mockService.getRolePermissions(roleId);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    // According to your API docs, this should be a PUT request
    return this.http
      .put<string[]>(`${this.baseUrl}/roles/${roleId}/permissions`, null, {
        headers,
      })
      .pipe(
        tap((permissions) =>
          console.log(`Permissions for role ${roleId}:`, permissions)
        ),
        catchError((error) => {
          console.error(`Error getting permissions for role ${roleId}:`, error);
          return throwError(() => error);
        })
      );
  }

  assignPermissionToRole(
    roleId: number,
    permissionId: number
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    const url = `${this.baseUrl}/roles/${roleId}/permissions/${permissionId}`;
    return this.http.put(url, null, { headers }).pipe(
      tap(() =>
        console.log(`Permission ${permissionId} assigned to role ${roleId}`)
      ),
      catchError((error) => {
        console.error(
          `Error assigning permission ${permissionId} to role ${roleId}`,
          error
        );
        return throwError(() => error);
      })
    );
  }

  // Assign role with multiple permissions
  assignMultiplePermissionsToRole(
    roleId: number,
    permissionIds: number[]
  ): Observable<any> {
    if (this.useMockData) {
      return this.mockService.updateRolePermissions(
        roleId,
        permissionIds.map((id) => id.toString())
      );
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    const url = `${this.baseUrl}/roles/${roleId}/permissions/multiple`;

    // Send raw array, not an object
    const payload = permissionIds;

    console.log('Assigning multiple permissions:', payload, 'to role:', roleId);

    return this.http.put(url, payload, { headers }).pipe(
      tap(() =>
        console.log(`Multiple permissions assigned to role ${roleId}:`, payload)
      ),
      catchError((error) => {
        console.error(
          `Error assigning multiple permissions to role ${roleId}`,
          error
        );
        return throwError(() => error);
      })
    );
  }

  // Update permissions for a role - DEPRECATED: Use assignMultiplePermissionsToRole instead
  updateRolePermissions(
    roleId: number,
    permissions: string[]
  ): Observable<any> {
    console.log(
      'updateRolePermissions is deprecated, use assignMultiplePermissionsToRole instead'
    );

    if (this.useMockData) {
      return this.mockService.updateRolePermissions(roleId, permissions);
    }

    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    return this.http
      .put(
        `${this.baseUrl}/roles/${roleId}/permissions`,
        { permissions },
        { headers }
      )
      .pipe(
        tap((_) => console.log(`Permissions updated for role id=${roleId}`)),
        catchError((error) => {
          console.error('Error updating role permissions:', error);
          return throwError(() => error);
        })
      );
  }

  // Toggle between mock and real API for testing purposes
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    console.log(`Switched to ${useMock ? 'MOCK' : 'REAL'} data source`);
  }

  // Test endpoint connectivity
  testConnection(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authentication token not found.'));
    }

    console.log('Testing connection to:', `${this.baseUrl}/roles`);

    return this.http.get(`${this.baseUrl}/roles`, { headers }).pipe(
      tap((response) => console.log('Connection test successful:', response)),
      catchError((error) => {
        console.error('Connection test failed:', error);
        return throwError(() => error);
      })
    );
  }

  // Enhanced error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Log more details for debugging
      if (error.status) {
        console.error(`HTTP Status: ${error.status}`);
        console.error(`Error Message: ${error.message}`);
        console.error(`URL: ${error.url}`);
      }

      // Return safe fallback result
      return of(result as T);
    };
  }
}
