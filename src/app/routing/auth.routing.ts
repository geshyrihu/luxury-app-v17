import { Routes } from '@angular/router';

export default [
  {
    path: '',
    title: 'Login',
    data: { title: 'Login' },
    loadComponent: () => import('src/app/pages/auth/login/login.component'),
  },
  {
    path: 'login',
    title: 'Login',
    data: { title: 'Login' },
    loadComponent: () => import('src/app/pages/auth/login/login.component'),
  },
  {
    path: 'recovery-password',
    title: 'Recovery Password',
    data: { title: 'Recuperar contraseña' },
    loadComponent: () =>
      import(
        'src/app/pages/auth/recovery-password/recovery-password.component'
      ),
  },
] as Routes;
