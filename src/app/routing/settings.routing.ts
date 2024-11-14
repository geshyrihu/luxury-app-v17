import { Routes } from '@angular/router';

export default [
  {
    path: 'depuration',
    loadComponent: () =>
      import('src/app/pages/1.2-mail-empresa/depuracion/depuracion.component'),
    data: { title: 'Depuración' },
  },

  {
    path: 'supplier-supervisors',
    loadComponent: () =>
      import(
        'src/app/pages/0-settings/provider-support/provider-support.component'
      ),
    data: { title: 'Supervisores de Proveedores' },
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('src/app/pages/0-settings/customer/list-customer.component'),
    data: { title: 'Clientes' },
  },
  {
    path: 'customer-data-company',
    title: 'CustomerDataCompany',
    loadComponent: () =>
      import(
        'src/app/pages/1.2-mail-empresa/customer-data-company/list-customer-data-company.component'
      ),
    data: { title: 'Datos del Cliente por Empresa' },
  },

  {
    path: 'datos-email',
    loadComponent: () =>
      import(
        'src/app/pages/1.2-mail-empresa/email-data/list-email-data.component'
      ),
    title: 'Datos de Correo',
    data: { title: 'Datos de Correo' },
  },
] as Routes;
