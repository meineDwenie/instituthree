import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role';

@Component({
  selector: 'app-add-role-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './add-role-dialog.component.html',
  styleUrl: './add-role-dialog.component.scss',
})
export class AddRoleDialogComponent {
  roleName: string = '';
  roleDescription: string = '';

  constructor(public dialogRef: MatDialogRef<AddRoleDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.roleName.trim()) {
      this.dialogRef.close({
        name: this.roleName.trim(),
        description: this.roleDescription.trim(),
      });
    } else {
      alert('Role name cannot be empty');
    }
  }
}
