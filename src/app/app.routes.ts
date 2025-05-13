import { Routes } from '@angular/router';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { RolesComponent } from './pages/roles/roles.component';
import { PermissionsComponent } from './pages/permissions/permissions.component';

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
  {
    path: 'user-management',
    loadComponent: () =>
      import('./pages/user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles/roles.component').then((m) => m.RolesComponent),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./pages/permissions/permissions.component').then(
        (m) => m.PermissionsComponent
      ),
  },
  {
    path: 'edit-user-dialog',
    loadComponent: () =>
      import('./shared/edit-user-dialog/edit-user-dialog.component').then(
        (m) => m.EditUserDialogComponent
      ),
  },
];
