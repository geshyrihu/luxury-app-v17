import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

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
  {
    path: 'application-user',
    title: 'Cuentas de Usuario',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/list-application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Application User' },
  },
  {
    path: 'module-app-rol',
    title: 'Administración Roles Modulos',
    loadComponent: () =>
      import('src/app/pages/settings/module-app-rol/module-app-rol.component'),
    canActivate: [AuthGuard],
    data: { title: 'Administración Roles Modulos' },
  },
  {
    title: 'CustomerModul',
    data: { title: 'Modulos Clientes' },
    path: 'customer-modul',
    loadComponent: () =>
      import(
        'src/app/pages/settings/customer-modul-list/customer-modul-list.component'
      ),
  },
  {
    title: 'CustomerModulEdit',
    data: { title: 'Editar modulos' },
    path: 'customer-modul-edit/:customerId/:customerName',
    loadComponent: () =>
      import(
        'src/app/pages/settings/customer-modul-edit/customer-modul-edit.component'
      ),
  },
  {
    title: 'Module App',
    data: { title: 'Lista de Módulos' },
    path: 'module-app',
    loadComponent: () =>
      import(
        'src/app/pages/settings/module-app-list/module-app-list.component'
      ),
  },
  {
    title: 'Actualizar modulos a Role',
    data: { title: 'Actualizar modulos a Role' },
    path: 'module-app-rol-update/:roleId/:roleName',
    loadComponent: () =>
      import(
        'src/app/pages/settings/module-app-rol/module-app-rol-update.component'
      ),
  },
] as Routes;
