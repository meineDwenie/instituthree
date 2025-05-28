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
import { Permission } from '../../models/permission'; // Import Permission from models
import { RolesService } from '../../services/roles.service'; // Import only RolesService
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

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

  // Dynamic permission groups from API
  permissionGroups: Array<{
    name: string;
    permissions: Array<{
      id: string;
      name: string;
      description: string;
      checked: boolean;
    }>;
  }> = [];

  constructor(
    private dialogRef: MatDialogRef<EditRolesPermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { roleId: number },
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.roleId = this.data.roleId;
    this.loadRoleData();
  }

  loadRoleData(): void {
    this.isLoading = true;

    // Load both role data and available permissions
    forkJoin({
      role: this.rolesService.getRoleById(this.roleId),
      permissions: this.rolesService.getAllPermissions(),
      allRolePermissions: this.rolesService.getAllRolesPermissions(),
    }).subscribe({
      next: ({ role, permissions, allRolePermissions }) => {
        this.role = role;
        this.availablePermissions = permissions;
        this.createPermissionGroups();

        const matching = allRolePermissions.find((r) => r.role === role.name);
        if (matching) {
          this.setPermissionsFromArray(matching.permissions);
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;

        // Check if it's an authentication error
        if (error.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert('Failed to load data. Please try again.');
        }

        this.dialogRef.close();
      },
    });
  }

  createPermissionGroups(): void {
    this.permissionGroups = [
      {
        name: 'Basic Permissions',
        permissions: this.availablePermissions.map((perm) => ({
          id: perm.id.toString(), // Use permission name as ID to string
          name: perm.name,
          description: perm.description,
          checked: false,
        })),
      },
    ];
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
    if (!permissions || !Array.isArray(permissions)) return;

    permissions.forEach((permId) => {
      this.setPermission(permId, true);
    });
  }

  setPermission(permId: string, value: boolean): void {
    for (const group of this.permissionGroups) {
      const perm = group.permissions.find((p) => p.id === permId);
      if (perm) {
        perm.checked = value;
        break;
      }
    }
  }

  // for save permissions button
  savePermissions(): void {
    if (!this.role) return;

    this.isLoading = true;

    // Collect all checked permissions
    const selectedPermissions: string[] = [];

    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => {
        if (perm.checked) {
          selectedPermissions.push(perm.id); // permission name like "READ"
        }
      });
    });

    // First update the role info (name, description)
    this.rolesService.updateRole(this.role).subscribe({
      next: () => {
        console.log('Role info updated successfully');

        this.rolesService
          .updateRolePermissions(this.roleId, selectedPermissions)
          .subscribe({
            next: () => {
              console.log('All permissions updated successfully');
              this.isLoading = false;
              this.dialogRef.close(true);
            },
            error: (error) => {
              console.error('Error saving permissions:', error);
              this.isLoading = false;
              alert('Failed to save permissions. Please try again.');
            },
          });
      },
      error: (error) => {
        console.error('Error updating role info:', error);
        this.isLoading = false;
        alert('Failed to update role information. Please try again.');
      },
    });
  }

  cancel(): void {
    // Close dialog without saving
    this.dialogRef.close(false);
  }
}
