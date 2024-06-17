import { Routes } from '@angular/router';

export default [
  {
    path: 'proveedor',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/proveedor/dashboard-proveedor/dashboard-proveedor.component'
      ),
  },
  {
    path: 'condominos',
    loadComponent: () =>
      import('src/app/pages/list-condominos/list-condominos.component'),
  },
  {
    path: 'propiedades',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/propiedades/list-propiedades.component'
      ),
  },
  {
    path: 'comite-vigilancia',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/comite-vigilancia/list-comite-vigilancia.component'
      ),
  },
  {
    path: 'personal-interno',
    loadComponent: () =>
      import(
        'src/app/pages/employee/list-employee-customer/list-employee-customer.component'
      ),
  },
  {
    path: 'personal-externo',
    loadComponent: () =>
      import(
        'src/app/pages/employee/list-employee-provider-customer/list-employee-provider-customer.component'
      ),
  },

  {
    path: 'empleado',
    loadComponent: () =>
      import(
        'src/app/pages/employee/employee-add-or-edit/employee-add-or-edit.component'
      ),
  },
  {
    path: 'empleados-general',
    loadComponent: () =>
      import(
        'src/app/pages/employee/list-general-employee/list-general-employee.component'
      ),
  },
  {
    path: 'telefonos-emergencia',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/telefonos-emergencia/telefonos-emergencia.component'
      ),
  },
  {
    path: 'organigrama-interno',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/organigrama-interno/organigrama-interno.component'
      ),
  },
] as Routes;
