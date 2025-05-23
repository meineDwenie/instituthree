import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserData } from '../../models/userdata';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditUserDialogComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] = ['Usuario', 'Admin'];
  statuses: string[] = ['Active', 'Pending'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserData }
  ) {
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      status: ['', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {
    if (this.data?.user) {
      this.userForm.patchValue({
        id: this.data.user.id,
        name: this.data.user.name,
        lastName: this.data.user.lastName,
        email: this.data.user.email,
        password: this.data.user.password,
        role: this.data.user.role,
        status: this.data.user.status,
        photoUrl: this.data.user.photoUrl,
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid && this.data?.user) {
      const updatedUser: UserData = {
        ...this.userForm.getRawValue(),
        id: this.data.user.id,
      };

      this.dialogRef.close(updatedUser);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Getter methods for form controls (for cleaner validation access in template)
  get name() {
    return this.userForm.get('name');
  }

  get lastName() {
    return this.userForm.get('lastName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get role() {
    return this.userForm.get('role');
  }

  get status() {
    return this.userForm.get('status');
  }

  get password() {
    return this.userForm.get('password');
  }
}
