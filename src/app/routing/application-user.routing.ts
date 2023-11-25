import { Routes } from '@angular/router';

export default [
  {
    path: 'cuentas-usuario',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/list-account/list-account.component'
      ),
    title: 'Cuentas de acceso',
  },
  {
    path: 'actualizar-perfil',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/update-profile/update-profile.component'
      ),
    title: 'Acutalizar perfil',
  },
  {
    path: 'datos-email',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/email-data/list-email-data.component'
      ),
    title: 'Datos de correo',
  },
  {
    path: 'cliente',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/accounts/account-customer/account-customer.component'
      ),
    title: 'Cliente',
  },
] as Routes;
