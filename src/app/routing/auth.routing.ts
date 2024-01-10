import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('src/app/pages/auth/router-login/dash-panel.component'),
    children: [
      {
        loadComponent: () => import('src/app/pages/auth/login/login.component'),
        path: 'login',
        title: 'Autenticación',
      },
      {
        path: 'restablecer-contrasena',
        loadComponent: () =>
          import(
            'src/app/pages/auth/restaurar-contraseña/restaurar-contraseña.component'
          ),
        title: 'Restablecer contraseña',
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import(
            'src/app/pages/auth/recuperar-contraseña/recuperar-contraseña.component'
          ),
        title: 'Recuperar contraseña',
      },
    ],
  },
] as Routes;
