import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: 'Student' | 'Professor' | 'Admin' | 'Tutor' | 'Delegado';
  status: 'Active' | 'Pending';
  photoUrl: string;
}

const FULL_NAMES: string[] = [
  'John Doe',
  'Jane Smith',
  'Alice Johnson',
  'Bob Brown',
  'Charlie Davis',
  'Diana Prince',
  'Ethan Hunt',
  'Felicity Smoak',
  'George Washington',
  'Hannah Montana',
  'Ivy League',
  'Jack Sparrow',
  'Katherine Johnson',
  'Liam Neeson',
  'Mia Wallace',
  'Noah Centineo',
  'Olivia Pope',
  'Peter Parker',
  'Quinn Fabray',
  'Rachel Green',
];

const ROLE_OPTIONS: UserData['role'][] = [
  'Student',
  'Professor',
  'Admin',
  'Tutor',
  'Delegado',
];
const STATUS_OPTIONS: UserData['status'][] = ['Active', 'Pending'];

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['nameId', 'email', 'role', 'status', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor() {
    const users = Array.from({ length: 100 }, (_, i) => createUser(i + 1));
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function createUser(index: number): UserData {
  const name = FULL_NAMES[index % FULL_NAMES.length];
  const [first, last] = name.split(' ');

  return {
    id: (1000 + index).toString(),
    fullName: name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    role: ROLE_OPTIONS[Math.floor(Math.random() * ROLE_OPTIONS.length)],
    status: STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)],
    photoUrl: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
  };
}
