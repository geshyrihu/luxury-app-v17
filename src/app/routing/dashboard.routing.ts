import { Routes } from '@angular/router';

export default [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('src/app/pages/operaciones/dashboard/dashboard.component'),
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
] as Routes;
