import { Routes } from '@angular/router';

export default [
  {
    loadComponent: () => import('src/app/pages/auth/login/login.component'),
    path: '',
    title: 'Autenticación',
  },
  {
    loadComponent: () => import('src/app/pages/auth/login/login.component'),
    path: 'login',
    title: 'Autenticación',
  },
] as Routes;
