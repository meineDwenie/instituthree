import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root',
})
export class MockPermissionsService {
  // Internal mock data
  private mockPermissions: Permission[] = [
    { id: 1, name: 'READ', description: 'Permiso de lectura' },
    { id: 2, name: 'WRITE', description: 'Permiso de escritura' },
    { id: 3, name: 'DELETE', description: 'Permiso para borrar datos' },
  ];

  constructor() {}

  getAllPermissions(): Observable<Permission[]> {
    return of([...this.mockPermissions]).pipe(delay(600));
  }

  getPermissionById(id: number): Observable<Permission | undefined> {
    const permission = this.mockPermissions.find((p) => p.id === id);
    return of(permission).pipe(delay(500));
  }

  createPermission(permission: Permission): Observable<Permission> {
    const newPermission = {
      ...permission,
      id: this.mockPermissions.length + 1,
    };
    this.mockPermissions.push(newPermission);
    return of(newPermission).pipe(delay(500));
  }

  updatePermission(permission: Permission): Observable<Permission> {
    const index = this.mockPermissions.findIndex((p) => p.id === permission.id);
    if (index !== -1) {
      this.mockPermissions[index] = permission;
    }
    return of(permission).pipe(delay(500));
  }

  deletePermission(id: number): Observable<{ success: boolean }> {
    this.mockPermissions = this.mockPermissions.filter((p) => p.id !== id);
    return of({ success: true }).pipe(delay(500));
  }
}
