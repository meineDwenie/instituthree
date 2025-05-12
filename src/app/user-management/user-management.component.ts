import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from '../shared/header-nav/header-nav.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { UsersTableComponent } from '../shared/users-table/users-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    HeaderNavComponent,
    SidebarComponent,
    UsersTableComponent,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  displayedColumns: string[] = ['nameId', 'email', 'role', 'status', 'actions'];

  users = [
    {
      id: 12345,
      name: 'John Doe',
      email: 'johndoe@email.com',
      role: 'Student',
      status: 'Active',
      photo: 'https://randomuser.me/api/portraits',
    },
    {
      id: 67890,
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      role: 'Teacher',
      status: 'Pending',
      photo: 'https://via.placeholder.com/40',
    },
  ];
}
