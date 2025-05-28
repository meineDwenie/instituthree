import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Role } from '../models/role';

/**
 * This service provides mock roles data for development and testing.
 * It simulates API responses with Observable patterns to match the real service.
 */
@Injectable({
  providedIn: 'root',
})
export class MockRolesService {
  // Mock roles data
  private mockRoles: Role[] = [
    {
      id: 1,
      name: 'Admin',
      description: 'Administrador del sistema',
      photoUrl: 'assets/images/roles/admin.png',
    },
    {
      id: 2,
      name: 'Professor',
      description: 'Profesor de cursos',
      photoUrl: 'assets/images/roles/professor.png',
    },
    {
      id: 3,
      name: 'Student',
      description: 'Estudiante registrado',
      photoUrl: 'assets/images/roles/student.png',
    },
    {
      id: 4,
      name: 'Delegado',
      description: 'Representante de grupo',
      photoUrl: 'assets/images/roles/delegado.png',
    },
    {
      id: 5,
      name: 'Tutor',
      description: 'Tutor académico',
      photoUrl: 'assets/images/roles/tutor.png',
    },
  ];

  // Sample permission structure for each role
  private rolePermissions: { [roleId: number]: string[] } = {
    1: [
      'view_users',
      'create_users',
      'edit_users',
      'delete_users',
      'view_courses',
      'create_courses',
      'edit_courses',
      'delete_courses',
      'view_reports',
      'create_reports',
      'export_reports',
    ], // Admin has all permissions
    2: [
      'view_users',
      'view_courses',
      'create_courses',
      'edit_courses',
      'view_reports',
      'create_reports',
      'export_reports',
    ], // Professor permissions
    3: ['view_courses', 'view_reports'], // Student permissions
    4: ['view_users', 'view_courses', 'create_reports', 'view_reports'], // Delegado permissions
    5: ['view_users', 'view_courses', 'edit_courses', 'view_reports'], // Tutor permissions
  };

  constructor() {}

  /**
   * Get all roles
   * @returns Observable of Role array with simulated network delay
   */
  getRoles(): Observable<Role[]> {
    // Return a copy of mock data with a simulated network delay
    return of([...this.mockRoles]).pipe(delay(800));
  }

  /**
   * Get a role by ID
   * @param id Role ID to find
   * @returns Observable of the found Role or undefined
   */
  getRoleById(id: number): Observable<Role> {
    const role = this.mockRoles.find((role) => role.id === id);

    if (!role) {
      // Simulate a "not found" scenario
      return of({} as Role).pipe(delay(500));
    }

    return of({ ...role }).pipe(delay(500));
  }

  /**
   * Create a new role
   * @param role Role data to create
   * @returns Observable of the created Role with new ID
   */
  createRole(role: Role): Observable<Role> {
    // Create a new role with a generated ID
    const newRole: Role = {
      ...role,
      id: this.generateId(),
    };

    this.mockRoles.push(newRole);
    return of({ ...newRole }).pipe(delay(800));
  }

  /**
   * Update an existing role
   * @param role Role data to update
   * @returns Observable of the updated Role
   */
  updateRole(role: Role): Observable<Role> {
    const index = this.mockRoles.findIndex((r) => r.id === role.id);

    if (index !== -1) {
      this.mockRoles[index] = { ...role };
      return of({ ...role }).pipe(delay(800));
    }

    // If role not found, return empty object
    return of({} as Role).pipe(delay(500));
  }

  /**
   * Delete a role by ID
   * @param id Role ID to delete
   * @returns Observable of success status
   */
  deleteRole(id: number): Observable<boolean> {
    const index = this.mockRoles.findIndex((role) => role.id === id);

    if (index !== -1) {
      this.mockRoles.splice(index, 1);
      return of(true).pipe(delay(800));
    }

    return of(false).pipe(delay(500));
  }

  /**
   * Get permissions for a specific role
   * @param roleId The role ID to get permissions for
   * @returns Observable of string array of permission IDs
   */
  getRolePermissions(roleId: number): Observable<string[]> {
    const permissions = this.rolePermissions[roleId] || [];
    return of([...permissions]).pipe(delay(800));
  }

  /**
   * Update permissions for a specific role
   * @param roleId The role ID to update permissions for
   * @param permissions Array of permission IDs
   * @returns Observable indicating success
   */
  updateRolePermissions(
    roleId: number,
    permissions: string[]
  ): Observable<boolean> {
    this.rolePermissions[roleId] = [...permissions];
    return of(true).pipe(delay(800));
  }

  /**
   * Generate a simple ID for mock data
   * @returns A new unique ID
   */
  private generateId(): number {
    // Find the highest current ID and add 1
    const maxId = Math.max(...this.mockRoles.map((role) => role.id));
    return maxId + 1;
  }
}
