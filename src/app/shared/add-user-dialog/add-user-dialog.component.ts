import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  Form,
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
  selector: 'app-add-user-dialog',
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
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss',
})
export class AddUserDialogComponent implements OnInit {
  userForm: FormGroup;
  roles: string[] = ['Student', 'Professor', 'Admin', 'Tutor', 'Delegado'];
  statuses: string[] = ['Active', 'Pending'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserData }
  ) {
    this.userForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Add or remove pssword?
      role: ['', Validators.required],
      status: ['', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {
    // Populate form with user data
    if (this.data.user) {
      this.userForm.patchValue(this.data.user);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      this.dialogRef.close(updatedUser);
    } else {
      console.log('Form is invalid');
    }
  }

  // Getter methods for form controls (useful for validation in the template)
  get fullName() {
    return this.userForm.get('fullName');
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
