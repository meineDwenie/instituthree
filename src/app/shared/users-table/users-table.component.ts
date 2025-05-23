import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserData } from '../../models/userdata';
import { MatIcon } from '@angular/material/icon';

/*
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
*/
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
    MatIcon,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent implements OnInit, AfterViewInit {
  // For table reusable
  @Input() displayedColumns: string[] = [
    'nameId',
    'email',
    'role',
    'status',
    'actions',
  ];
  @Input() set userData(users: UserData[]) {
    this.dataSource = new MatTableDataSource<UserData>(users);
    setTimeout(() => {
      if (this.sort && this.paginator) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  // Output for actions
  @Output() editUser = new EventEmitter<UserData>();
  @Output() deleteUser = new EventEmitter<UserData>();
  @Output() filterChange = new EventEmitter<string>();

  // Table data source
  dataSource = new MatTableDataSource<UserData>([]);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor() {}

  ngOnInit(): void {
    //this.loadUsers();
    // Initial configuration
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

    // Emit the filter value to parent component
    this.filterChange.emit(filterValue);
  }

  onEdit(user: UserData) {
    this.editUser.emit(user);
  }

  onDelete(user: UserData) {
    this.deleteUser.emit(user);
  }
}
