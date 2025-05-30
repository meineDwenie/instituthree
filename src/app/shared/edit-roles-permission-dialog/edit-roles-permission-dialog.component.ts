import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Role } from '../../models/role';
import {
  Permission,
  PermissionGroup,
  GroupedPermission,
} from '../../models/permission';
import { RolesService } from '../../services/roles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, Observable, throwError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-roles-permission-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit-roles-permission-dialog.component.html',
  styleUrl: './edit-roles-permission-dialog.component.scss',
})
export class EditRolesPermissionDialogComponent implements OnInit {
  private baseUrl: string;
  private useMockData: boolean;

  roleId!: number;

  role: Role = {
    id: 0,
    name: '',
    description: '',
    photoUrl: '',
    permissions: [],
  };

  isLoading = true;
  availablePermissions: Permission[] = [];
  permissionGroups: PermissionGroup[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditRolesPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { roleId: number },
    private rolesService: RolesService,
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
    this.useMockData = environment.useMockData;

    console.log(
      `RolesService initialized with ${
        this.useMockData ? 'MOCK' : 'REAL'
      } data source`
    );
  }

  ngOnInit(): void {
    this.roleId = this.data.roleId;
    this.loadRoleData();
  }

  loadRoleData(): void {
    this.isLoading = true;

    // First load role and permissions
    forkJoin({
      role: this.rolesService.getRoleById(this.roleId),
      permissions: this.rolesService.getAllPermissions(),
    }).subscribe({
      next: ({ role, permissions }) => {
        console.log('Loaded role:', role);
        console.log('Loaded permissions:', permissions);

        this.role = role;
        this.availablePermissions = permissions;
        this.createPermissionGroups();

        // Now load role permissions with improved fallback
        this.loadRolePermissionsWithFallback();
      },
      error: (error) => {
        console.error('Error loading basic data:', error);
        this.handleLoadError(error);
      },
    });
  }

  private loadRolePermissionsWithFallback(): void {
    // First try the specific endpoint (with PUT method as per your API docs)
    this.rolesService
      .getRolePermissions(this.roleId)
      .pipe(
        catchError((error) => {
          console.warn(
            'Primary getRolePermissions failed, trying fallback:',
            error
          );

          // Fallback 1: Try to get from role.permissions if it exists and is populated
          if (this.role.permissions && this.role.permissions.length > 0) {
            console.log('Using permissions from role object');
            // Convert Permission objects to string array
            const permissionNames = this.role.permissions.map((p) =>
              typeof p === 'string' ? p : p.name
            );
            return of(permissionNames);
          }

          // Fallback 2: Try to extract from getAllRolesPermissions
          return this.rolesService.getAllRolesPermissions().pipe(
            catchError((fallbackError) => {
              console.warn(
                'Fallback getAllRolesPermissions also failed:',
                fallbackError
              );
              // Return empty array as final fallback
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (rolePermissions) => {
          console.log('Role permissions loaded:', rolePermissions);

          if (
            Array.isArray(rolePermissions) &&
            rolePermissions.every((p) => typeof p === 'string')
          ) {
            // Handle direct string array from getRolePermissions
            this.setPermissionsFromArray(rolePermissions);
          } else if (
            Array.isArray(rolePermissions) &&
            rolePermissions.length > 0 &&
            typeof rolePermissions[0] === 'object' &&
            'permissions' in rolePermissions[0]
          ) {
            // Array of { role: string, permissions: string[] }
            const allRolesPermissions = rolePermissions as {
              role: string;
              permissions: string[];
            }[];

            const currentRoleData = allRolesPermissions.find(
              (rp) =>
                rp.role === this.role.name ||
                rp.role.toLowerCase() === this.role.name.toLowerCase()
            );

            if (currentRoleData?.permissions) {
              this.setPermissionsFromArray(currentRoleData.permissions);
            } else {
              console.log(
                'No permissions found for role in getAllRolesPermissions response'
              );
            }
          } else {
            console.warn('Unexpected permissions format:', rolePermissions);
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('All permission loading methods failed:', error);
          this.isLoading = false;
          // Continue without pre-selected permissions
        },
      });
  }

  createPermissionGroups(): void {
    this.permissionGroups = [
      {
        name: 'Basic Permissions',
        permissions: this.availablePermissions.map(
          (perm): GroupedPermission => ({
            id: perm.name,
            name: perm.name,
            description: perm.description,
            checked: false,
          })
        ),
      },
    ];

    console.log('Created permission groups:', this.permissionGroups);
  }

  resetPermissions(): void {
    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => {
        perm.checked = false;
      });
    });
  }

  checkAllPermissions(): void {
    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => (perm.checked = true));
    });
  }

  setPermissionsFromArray(permissions: string[]): void {
    if (!permissions || !Array.isArray(permissions)) {
      console.log('No permissions array provided or invalid format');
      return;
    }

    console.log('Setting permissions from array:', permissions);

    // Reset all permissions first
    this.resetPermissions();

    // Set permissions that match
    permissions.forEach((permName) => {
      this.setPermission(permName, true);
    });

    console.log('Permissions set. Current state:', this.permissionGroups);
  }

  setPermission(permName: string, value: boolean): void {
    let found = false;

    for (const group of this.permissionGroups) {
      const perm = group.permissions.find(
        (p) => p.id === permName || p.name === permName
      );
      if (perm) {
        perm.checked = value;
        console.log(`Set permission ${permName} to ${value}`);
        found = true;
        break;
      }
    }

    if (!found) {
      console.warn(`Permission ${permName} not found in available permissions`);
    }
  }

  savePermissions(): void {
    if (!this.role) return;

    this.isLoading = true;

    // Collect all checked permissions
    const selectedPermissions: string[] = [];

    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => {
        if (perm.checked) {
          selectedPermissions.push(perm.name); // Use name, not id
        }
      });
    });

    console.log('Saving permissions:', selectedPermissions);

    // First update the role info (name, description)
    this.rolesService.updateRole(this.role).subscribe({
      next: () => {
        console.log('Role info updated successfully');

        // Then update permissions - convert permission names to IDs if needed
        this.updateRolePermissionsById(selectedPermissions);
      },
      error: (error) => {
        console.error('Error updating role info:', error);
        this.isLoading = false;
        alert('Failed to update role information. Please try again.');
      },
    });
  }

  private updateRolePermissionsById(selectedPermissionNames: string[]): void {
    // Convert permission names to IDs for the multiple assignment endpoint
    const permissionIds: number[] = [];

    selectedPermissionNames.forEach((permName) => {
      const permission = this.availablePermissions.find(
        (p) => p.name === permName
      );
      if (permission) {
        permissionIds.push(permission.id);
      }
    });

    console.log('Permission IDs to assign:', permissionIds);

    if (permissionIds.length === 0) {
      // No permissions to assign, just finish
      this.isLoading = false;
      this.dialogRef.close(true);
      return;
    }

    // Use the multiple permissions endpoint
    this.rolesService
      .assignMultiplePermissionsToRole(this.roleId, permissionIds)
      .subscribe({
        next: () => {
          console.log('All permissions updated successfully');
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving permissions:', error);
          this.isLoading = false;

          // Show user-friendly error message
          if (error.status === 405) {
            alert(
              'Permission update endpoint not available. The role information was saved, but permissions could not be updated.'
            );
          } else {
            alert('Failed to save permissions. Please try again.');
          }
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  // Track by function for better performance
  trackByPermissionId(index: number, permission: GroupedPermission): string {
    return permission.id;
  }

  // Get selected permissions count
  getSelectedPermissionsCount(): number {
    let count = 0;
    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => {
        if (perm.checked) count++;
      });
    });
    return count;
  }

  // Get total permissions count
  getTotalPermissionsCount(): number {
    let count = 0;
    this.permissionGroups.forEach((group) => {
      count += group.permissions.length;
    });
    return count;
  }

  private handleLoadError(error: any): void {
    this.isLoading = false;

    let message = 'Failed to load data. Please try again.';

    if (error.status === 401) {
      message = 'Authentication failed. Please log in again.';
    } else if (error.status === 405) {
      message =
        'Some API endpoints are not available. Limited functionality may be available.';
    } else if (error.status === 404) {
      message = 'Role not found.';
    } else if (error.status === 0) {
      message = 'Network error. Please check your connection.';
    }

    alert(message);
    this.dialogRef.close();
  }
}
