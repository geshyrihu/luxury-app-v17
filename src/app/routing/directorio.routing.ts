import { Routes } from '@angular/router';

export default [
  {
    path: 'proveedor',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/proveedor/dashboard-proveedor/dashboard-proveedor.component'
      ),
  },
  {
    path: 'condominos',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/list-condominos/list-condominos.component'
      ),
  },
  {
    path: 'propiedades',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/propiedades/list-propiedades.component'
      ),
  },
  {
    path: 'comite-vigilancia',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/comite-vigilancia/list-comite-vigilancia.component'
      ),
  },
  {
    path: 'personal-interno',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/employee/list-employee-customer/list-employee-customer.component'
      ),
  },
  {
    path: 'personal-externo',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/employee-provider/list-employee-provider-customer.component'
      ),
  },

  {
    path: 'empleado',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/employee/employee-add-or-edit/employee-add-or-edit.component'
      ),
  },
  // {
  //   path: 'empleados-general',
  //   loadComponent: () =>
  //     import(
  //       'src/app/pages/employee/list-general-employee/list-general-employee.component'
  //     ),
  // },
  {
    path: 'telefonos-emergencia',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/telefonos-emergencia/telefonos-emergencia.component'
      ),
  },
  {
    path: 'organigrama-interno',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/organigrama-interno/organigrama-interno.component'
      ),
  },
] as Routes;
