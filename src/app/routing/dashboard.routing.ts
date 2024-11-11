import { Routes } from '@angular/router';

export default [
  {
    path: 'panel',
    loadComponent: () => import('src/app/pages/dashboard/dashboard.component'),
    data: { title: 'Dashboard' }, // Se añade un título para futuras referencias
  },

  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
] as Routes;
