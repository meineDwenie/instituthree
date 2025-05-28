import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from '../../shared/header-nav/header-nav.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsersTableComponent } from '../../shared/users-table/users-table.component';
import { Role } from '../../models/role';
import { AddRoleDialogComponent } from '../../shared/add-role-dialog/add-role-dialog.component';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { EditRolesPermissionDialogComponent } from '../../shared/edit-roles-permission-dialog/edit-roles-permission-dialog.component';
import { UserData } from '../../models/userdata';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderNavComponent,
    SidebarComponent,
    UsersTableComponent,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['nameId', 'description', 'actions'];

  // This will store the UserData-compatible objects
  adaptedRolesData: UserData[] = [];

  isLoading = true; // Start with loading state as true

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    // Initial load of roles data
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;

    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.adaptRolesToUserData();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.isLoading = false;
        this.snackBar.open(
          'Failed to load roles. Please try again later.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }

  // Convert Role objects to UserData objects
  adaptRolesToUserData(): void {
    this.adaptedRolesData = this.roles.map((role) => {
      const defaultLastName = '';
      const defaultEmail = `${role.name.toLowerCase()}@example.com`;
      const defaultUsername = `${role.name.toLowerCase()}.${defaultLastName.toLowerCase()}`;

      return {
        id: role.id.toString(),
        name: role.name,
        lastName: defaultLastName,
        username: defaultUsername,
        email: defaultEmail,
        password: '',
        role: 'Usuario',
        status: 'Active',
        photoUrl: role.photoUrl || 'assets/images/default-role-icon.svg',
        originalRole: role,
      };
    });
  }

  openAddRoleDialog(): void {
    const dialogRef = this.dialog.open(AddRoleDialogComponent, {
      width: '400px',
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { name: string; description: string }) => {
        if (result?.name) {
          this.isLoading = true;

          // Create new role object
          const newRole: Role = {
            id: 0, // The API or mock service will generate the actual ID
            name: result.name,
            description: result.description || '',
            photoUrl: 'assets/images/default-role-icon.svg',
          };

          this.rolesService.createRole(newRole).subscribe({
            next: (createdRole) => {
              // Refresh the roles list
              this.loadRoles();

              // Show success message
              this.snackBar.open(
                `Role '${createdRole.name}' created successfully`,
                'Close',
                {
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                }
              );
            },
            error: (error) => {
              console.error('Error creating role:', error);
              this.isLoading = false;
              this.snackBar.open(
                'Failed to create role. Please try again later.',
                'Close',
                {
                  duration: 5000,
                  panelClass: ['error-snackbar'],
                }
              );
            },
          });
        }
      });
  }

  // Since we're passing UserData objects to the table, we need to extract the original Role
  findOriginalRole(userData: UserData): Role | undefined {
    return this.roles.find((role) => role.id.toString() === userData.id);
  }

  editPermissions(userData: UserData): void {
    const role = this.findOriginalRole(userData);
    if (role) {
      // edit popup
      setTimeout(() => {
        const dialogRef = this.dialog.open(EditRolesPermissionDialogComponent, {
          width: '800px',
          data: { roleId: role.id },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // Handle any updates after dialog closes if needed
            this.isLoading = true;

            // Dialog component should save the permissions
            // Refresh list to show any changes
            setTimeout(() => {
              this.loadRoles();

              // Show success message
              this.snackBar.open(
                `Permissions for '${role.name}' updated successfully`,
                'Close',
                {
                  duration: 3000,
                  panelClass: ['success-snackbar'],
                }
              );
            }, 500);
          }
        });
      }, 50);
    }
  }

  deleteRole(userData: UserData): void {
    const role = this.findOriginalRole(userData);
    if (role) {
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
        width: '400px',
        data: role,
      });

      dialogRef.afterClosed().subscribe((confirmDelete) => {
        if (confirmDelete) {
          this.isLoading = true;

          // Save the role data before deleting
          const photoUrl =
            role.photoUrl || 'assets/images/default-role-icon.svg';
          const roleName = role.name;
          const id = role.id.toString();

          this.rolesService.deleteRole(role.id).subscribe({
            next: () => {
              // Refresh the roles list
              this.loadRoles();

              // Show success message
              this.snackBar.open(
                `Role '${roleName}' deleted successfully`,
                'Close',
                {
                  duration: 3000,
                  panelClass: ['warning-snackbar'],
                }
              );
            },
            error: (error) => {
              console.error('Error deleting role:', error);
              this.isLoading = false;
              this.snackBar.open(
                'Failed to delete role. Please try again later.',
                'Close',
                {
                  duration: 5000,
                  panelClass: ['error-snackbar'],
                }
              );
            },
          });
        }
      });
    }
  }

  applyFilter(filterValue: string): void {
    // Handle filtering if needed
    console.log('Filter applied:', filterValue);
  }
}
