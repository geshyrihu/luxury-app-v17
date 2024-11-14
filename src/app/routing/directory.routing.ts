import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export default [
  {
    path: 'proveedor',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/proveedor/dashboard-proveedor/dashboard-proveedor.component'
      ),
    data: { title: 'Proveedor' },
  },
  {
    path: 'condominos',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/list-condominos/list-condominos.component'
      ),
    data: { title: 'Condominos' },
  },
  {
    path: 'propiedades',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/propiedades/list-propiedades.component'
      ),
    data: { title: 'Propiedades' },
  },
  {
    path: 'comite-vigilancia',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/comite-vigilancia/list-comite-vigilancia.component'
      ),
    data: { title: 'Comité de Vigilancia' },
  },
  {
    path: 'personal-interno',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/employee/list-employee-customer/list-employee-customer.component'
      ),
    data: { title: 'Personal Interno' },
  },
  {
    path: 'personal-externo',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/employee-provider/list-employee-provider-customer.component'
      ),
    data: { title: 'Personal Externo' },
  },
  {
    path: 'empleado',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/employee/employee-add-or-edit/employee-add-or-edit.component'
      ),
    data: { title: 'Empleado' },
  },
  {
    path: 'telefonos-emergencia',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/telefonos-emergencia/telefonos-emergencia.component'
      ),
    data: { title: 'Teléfonos de Emergencia' },
  },
  {
    path: 'organigrama-interno',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/organigrama-interno/organigrama-interno.component'
      ),
    data: { title: 'Organigrama Interno' },
  },
  {
    path: 'mis-proveedores',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/proveedor/mis-proveedores/mis-proveedores.component'
      ),
    canActivate: [AuthGuard], // Se agregó canActivate aquí
    data: { title: 'Mis Proveedores' },
  },
  {
    path: 'comites',
    loadComponent: () =>
      import('src/app/pages/6.1-directorios/comites/comites.component'),
    canActivate: [AuthGuard], // Se agregó canActivate aquí
    data: { title: 'Mis Proveedores' },
  },
] as Routes;
