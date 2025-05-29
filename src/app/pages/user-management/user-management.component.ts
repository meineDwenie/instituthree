import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersTableComponent } from '../../shared/users-table/users-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateUserRequest, UserData } from '../../models/userdata';
import { UsersService } from '../../services/users.service';
import { EditUserDialogComponent } from '../../shared/edit-user-dialog/edit-user-dialog.component';
import { DeleteUserDialogComponent } from '../../shared/delete-user-dialog/delete-user-dialog.component';
import { AddUserDialogComponent } from '../../shared/add-user-dialog/add-user-dialog.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableComponent,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  displayedColumns: string[] = ['nameId', 'email', 'role', 'status', 'actions'];

  users: UserData[] = [];

  isLoading = false;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidebarService: SidebarService
  ) {}

  isSidebarOpen = true;

  ngOnInit(): void {
    this.loadUsers();
    this.sidebarService.isOpen$.subscribe((open) => {
      this.isSidebarOpen = open;
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.snackBar.open(
          'Failed to load users. Please try again later.',
          'Close',
          {
            duration: 5000,
          }
        );
        this.isLoading = false;
      },
    });
  }

  handleEditUser(user: UserData): void {
    console.log('Edit user:', user);

    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUser(result);
      }
    });
  }

  handleDeleteUser(user: UserData): void {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '400px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.usersService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadUsers(); // Refreshes the user list after deletion
          },
          error: (error) => {
            console.error('Error deleting user:', error);

            let errorMsg = 'Failed to update user.';
            if (error.status === 403) {
              errorMsg = 'Permission denied. Only admins can update users.';
            } else if (error.status === 404) {
              errorMsg = 'User not found.';
            }

            this.snackBar.open(
              'Failed to delete user. Please try again later.',
              'Close',
              {
                duration: 5000,
              }
            );
          },
        });
      }
    });
  }

  handleFilterChange(filterValue: string): void {
    console.log('Filter applied:', filterValue);
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '500px',
      data: { user: {} }, // empty user object for a new user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addUser(result);
      }
    });
  }

  private updateUser(user: UserData): void {
    const updatePayload: CreateUserRequest = {
      username: user.email.split('@')[0],
      password: user.password,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      status: user.status === 'Active', // Convert to boolean as API expects
    };
    console.log('Update payload:', updatePayload);

    this.usersService.updateUserRequest(user.id, updatePayload).subscribe({
      next: () => {
        this.snackBar.open('User updated successfully', 'Close', {
          duration: 3000,
        });
        this.loadUsers(); // Refreshes the user list after update
      },
      error: (error) => {
        console.error('Error updating user:', error);

        let errorMsg = 'Failed to update user.';
        if (error.status === 403) {
          errorMsg = 'Permission denied. Only admins can update users.';
        } else if (error.status === 404) {
          errorMsg = 'User not found.';
        }

        this.snackBar.open(
          'Failed to update user. Please try again later.',
          'Close',
          {
            duration: 5000,
          }
        );
      },
    });
  }

  private addUser(user: any): void {
    // Map to API's CreateUserRequest format
    const requestPayload: CreateUserRequest = {
      username: user.email.split('@')[0], // You can change this if you want custom usernames
      password: user.password,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      status: user.status === 'Active', // Convert to boolean as API expects
    };

    this.usersService.createUserRequest(requestPayload).subscribe({
      next: (newUser) => {
        this.snackBar.open('User added successfully', 'Close', {
          duration: 3000,
        });
        this.loadUsers(); // Refreshes the user list after adding
      },
      error: (error) => {
        console.error('Error adding user:', error);

        let errorMsg = 'Failed to update user.';
        if (error.status === 403) {
          errorMsg = 'Permission denied. Only admins can update users.';
        } else if (error.status === 404) {
          errorMsg = 'User not found.';
        }

        this.snackBar.open(errorMsg, 'Close', {
          duration: 5000,
        });
      },
    });
  }
}
