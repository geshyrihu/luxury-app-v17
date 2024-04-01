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
  {
    loadComponent: () =>
      import(
        'src/app/pages/auth/recovery-password/recovery-password.component'
      ),
    path: 'recuperar-contrasena',
    title: 'Recuperar contraseña',
  },
  {
    path: 'restablecer-contrasena',
    loadComponent: () =>
      import(
        'src/app/pages/auth/restaurar-contraseña/restaurar-contraseña.component'
      ),
    title: 'Restablecer contraseña',
  },
] as Routes;
