import { Routes } from '@angular/router';

export default [
  {
    path: 'accounts',
    loadComponent: () =>
      import(
        'src/app/pages/0-settings/user-administration/list-application-user/list-application-user.component'
      ),
    title: 'Cuentas de acceso',
  },
  {
    path: 'actualizar-perfil',
    loadComponent: () =>
      import(
        'src/app/pages/0-settings/user-administration/update-profile/update-profile.component'
      ),
    title: 'Acutalizar perfil',
  },
  {
    path: 'datos-email',
    loadComponent: () =>
      import('src/app/pages/0-settings/email-data/list-email-data.component'),
    title: 'Datos de correo',
  },
] as Routes;
