import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersTableComponent } from '../../shared/users-table/users-table.component';
import { UserData } from '../../models/userdata';
import { PermissionsService } from '../../services/permissions.service'; // You’ll need to create this if it doesn't exist

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableComponent,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent implements OnInit {
  permissions: any[] = [];
  adaptedPermissionsData: UserData[] = [];
  isLoading = true;
  displayedColumns: string[] = ['nameId', 'description'];

  constructor(
    private permissionsService: PermissionsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.permissionsService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.adaptPermissionsToUserData();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching permissions:', err);
        this.snackBar.open('Failed to load permissions', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.isLoading = false;
      },
    });
  }

  adaptPermissionsToUserData(): void {
    this.adaptedPermissionsData = this.permissions.map((perm) => ({
      id: perm.id.toString(),
      name: perm.name,
      lastName: '',
      username: `${perm.name.toLowerCase()}`,
      email: `${perm.name.toLowerCase()}@permissions.app`,
      password: '',
      role: 'Admin', // or 'Permission' if you add it to the union type
      status: 'Active',
      photoUrl: 'assets/images/default-permission-icon.png',
      originalRole: perm,
    }));
  }

  editPermission(permission: UserData): void {
    console.log('Edit permission:', permission);
    // You could open an edit dialog here
  }

  deletePermission(permission: UserData): void {
    console.log('Delete permission:', permission);
    // You could add a confirmation + call delete API
  }

  applyFilter(value: string): void {
    console.log('Filter value:', value);
  }
}
