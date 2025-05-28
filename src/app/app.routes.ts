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

  // Layout route for protected pages
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'user-management',
        loadComponent: () =>
          import('./pages/user-management/user-management.component').then(
            (m) => m.UserManagementComponent
          ),
      },
      {
        path: 'roles-management',
        loadComponent: () =>
          import('./pages/roles-management/roles.component').then(
            (m) => m.RolesComponent
          ),
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
    ],
  },
];
