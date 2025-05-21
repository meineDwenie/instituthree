import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },

  {
    path: 'authentication',
    loadComponent: () =>
      import('./pages/authentication/authentication.component').then(
        (m) => m.AuthenticationComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  // Protected routes that require authentication
  {
    path: 'user-management',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
    canActivate: [AuthGuard], // AuthGuard here
  },
  {
    path: 'roles-management',
    loadComponent: () =>
      import('./pages/roles-management/roles.component').then(
        (m) => m.RolesComponent
      ),
    canActivate: [AuthGuard], // AuthGuard here
  },
  {
    path: 'edit-roles/:id',
    loadComponent: () =>
      import('./pages/edit-roles/edit-roles.component').then(
        (m) => m.EditRolesComponent
      ),
    canActivate: [AuthGuard], // AuthGuard here
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./pages/permissions/permissions.component').then(
        (m) => m.PermissionsComponent
      ),
    canActivate: [AuthGuard], // AuthGuard here
  },
  {
    path: 'edit-user-dialog',
    loadComponent: () =>
      import('./shared/edit-user-dialog/edit-user-dialog.component').then(
        (m) => m.EditUserDialogComponent
      ),
    canActivate: [AuthGuard], // AuthGuard here
  },
];
