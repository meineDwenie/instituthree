import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from '../../shared/header-nav/header-nav.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Role } from '../../models/role';
import { RolesService } from '../../services/roles.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-roles',
  standalone: true,
  imports: [
    CommonModule,
    HeaderNavComponent,
    SidebarComponent,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-roles.component.html',
  styleUrl: './edit-roles.component.scss',
})
export class EditRolesComponent implements OnInit {
  roleId!: number;
  role?: Role;
  isLoading = true;

  // Sample permissions list
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
    private route: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.roleId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.roleId) || this.roleId <= 0) {
      this.router.navigate(['/roles-management']);
      return;
    }
    this.loadRoleData();
  }

  loadRoleData(): void {
    this.isLoading = true;

    // Use forkJoin to get both role data and permissions at the same time
    forkJoin({
      role: this.rolesService.getRoleById(this.roleId),
      permissions: this.rolesService.getRolePermissions(this.roleId),
    }).subscribe({
      next: (result) => {
        this.role = result.role;

        if (!this.role || !this.role.id) {
          this.snackBar.open('Role not found', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
          this.router.navigate(['/roles-management']);
          return;
        }

        // Reset all permissions to unchecked
        this.resetPermissions();

        // Set checked permissions based on API response
        this.setPermissionsFromArray(result.permissions);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading role data:', error);
        this.isLoading = false;
        this.snackBar.open(
          'Failed to load role data. Please try again later.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
        this.router.navigate(['/roles-management']);
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

    this.rolesService
      .updateRolePermissions(this.roleId, selectedPermissions)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Permissions saved successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/roles-management']);
        },
        error: (error) => {
          console.error('Error saving permissions:', error);
          this.isLoading = false;
          this.snackBar.open(
            'Failed to save permissions. Please try again later.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/roles-management']);
  }
}
