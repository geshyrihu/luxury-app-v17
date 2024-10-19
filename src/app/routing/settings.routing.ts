import { Routes } from '@angular/router';
export default [
  {
    path: 'depuration',
    loadComponent: () =>
      import('src/app/pages/0-settings/depuracion/depuracion.component'),
  },
  {
    path: 'access-history',
    loadComponent: () =>
      import('src/app/pages/0-settings/historial-acceso/access-log.component'),
  },
  {
    path: 'supplier-supervisors',
    loadComponent: () =>
      import(
        'src/app/pages/0-settings/provider-support/provider-support.component'
      ),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('src/app/pages/0-settings/customer/list-customer.component'),
  },
  {
    path: 'depuracion',
    loadComponent: () =>
      import('src/app/pages/0-settings/depuracion/depuracion.component'),
  },

  {
    path: 'historial-acceso',
    loadComponent: () =>
      import('src/app/pages/0-settings/historial-acceso/access-log.component'),
  },

  {
    path: 'supervisores-proveedores',
    loadComponent: () =>
      import(
        'src/app/pages/0-settings/provider-support/provider-support.component'
      ),
  },

  {
    path: 'customer-data-company',
    title: 'CustomerDataCompany',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/customer-data-company/list-customer-data-company.component'
      ),
  },
] as Routes;
