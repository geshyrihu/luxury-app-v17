import { Routes } from '@angular/router';

export default [
  {
    path: 'cuentas-usuario',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/list-application-user/list-application-user.component'
      ),
    title: 'Cuentas de acceso',
  },
  {
    path: 'actualizar-perfil',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/update-profile/update-profile.component'
      ),
    title: 'Acutalizar perfil',
  },
  {
    path: 'datos-email',
    loadComponent: () =>
      import('src/app/pages/email-data/list-email-data.component'),
    title: 'Datos de correo',
  },
  // {
  //   path: 'cliente',
  //   loadComponent: () =>
  //     import(
  //       'src/app/pages/configuracion/accounts/account-customer/account-customer.component'
  //     ),
  //   title: 'Cliente',
  // },
] as Routes;
