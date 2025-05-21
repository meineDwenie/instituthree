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
import { RolesService } from '../../services/roles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  role?: Role;
  isLoading = true;

  // Permission groups
  permissionGroups = [
    {
      name: 'User Management',
      permissions: [
        { id: 'view_users', name: 'View Users', checked: false },
        { id: 'create_users', name: 'Create Users', checked: false },
        { id: 'edit_users', name: 'Edit Users', checked: false },
        { id: 'delete_users', name: 'Delete Users', checked: false },
      ],
    },
    {
      name: 'Course Management',
      permissions: [
        { id: 'view_courses', name: 'View Courses', checked: false },
        { id: 'create_courses', name: 'Create Courses', checked: false },
        { id: 'edit_courses', name: 'Edit Courses', checked: false },
        { id: 'delete_courses', name: 'Delete Courses', checked: false },
      ],
    },
    {
      name: 'Report Management',
      permissions: [
        { id: 'view_reports', name: 'View Reports', checked: false },
        { id: 'create_reports', name: 'Create Reports', checked: false },
        { id: 'export_reports', name: 'Export Reports', checked: false },
      ],
    },
  ];

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

    // Get role data
    this.rolesService.getRoleById(this.roleId).subscribe({
      next: (role) => {
        this.role = role;

        if (!this.role || !this.role.id) {
          this.dialogRef.close();
          return;
        }

        // Get role permissions
        this.rolesService.getRolePermissions(this.roleId).subscribe({
          next: (permissions) => {
            // Reset all permissions to unchecked
            this.resetPermissions();

            // Set checked permissions based on API response
            this.setPermissionsFromArray(permissions);

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading permissions:', error);
            this.isLoading = false;
            this.dialogRef.close();
          },
        });
      },
      error: (error) => {
        console.error('Error loading role:', error);
        this.isLoading = false;
        this.dialogRef.close();
      },
    });
  }

  resetPermissions(): void {
    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => {
        perm.checked = false;
      });
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

  savePermissions(): void {
    if (!this.role) return;

    this.isLoading = true;

    // Collect all checked permissions
    const selectedPermissions: string[] = [];

    this.permissionGroups.forEach((group) => {
      group.permissions.forEach((perm) => {
        if (perm.checked) {
          selectedPermissions.push(perm.id);
        }
      });
    });

    // Use the service to update permissions
    this.rolesService
      .updateRolePermissions(this.roleId, selectedPermissions)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving permissions:', error);
          this.isLoading = false;
          this.dialogRef.close(false);
        },
      });
  }

  cancel(): void {
    // Close dialog without saving
    this.dialogRef.close(false);
  }
}
