import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserData } from '../../models/userdata';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class DeleteUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserData }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirmDelete(): void {
    this.dialogRef.close(true);
  }
}
