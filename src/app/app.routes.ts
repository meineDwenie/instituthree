import { Routes } from '@angular/router';

export const routes: Routes = [
  //{ path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/authentication', pathMatch: 'full' },

  {
    path: 'authentication',
    loadComponent: () =>
      import('./authentication/authentication.component').then(
        (m) => m.AuthenticationComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'user-management',
    loadComponent: () =>
      import('./user-management/user-management.component').then(
        (m) => m.UserManagementComponent
      ),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./roles/roles.component').then((m) => m.RolesComponent),
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./permissions/permissions.component').then(
        (m) => m.PermissionsComponent
      ),
  },
];
