import { Routes } from '@angular/router';

export default [
  {
    title: 'Login',
    data: { title: 'Login' },
    path: '',
    loadComponent: () =>
      import('src/app/pages/authentication/login/login.component'),
  },
  {
    title: 'Login',
    data: { title: 'Login' },
    path: 'login',
    loadComponent: () =>
      import('src/app/pages/authentication/login/login.component'),
  },
  {
    title: 'Recovery Password',
    data: { title: 'Recuperar contraseña' },
    path: 'recovery-password',
    loadComponent: () =>
      import(
        'src/app/pages/authentication/recovery-password/recovery-password.component'
      ),
  },
  {
    title: 'Reset Password',
    data: { title: 'Restablecer contraseña' },
    path: 'reset-password',
    loadComponent: () =>
      import(
        'src/app/pages/authentication/restaurar-contraseña/restaurar-contraseña.component'
      ),
  },
] as Routes;
