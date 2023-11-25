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
      import(
        'src/app/pages/operaciones/directorios/condominos/list-condominos.component'
      ),
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
    path: 'empleados/:parametro',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/empleados/list-empleados.component'
      ),
  },
  {
    path: 'empleados-general',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/empleados/list-persons.component'
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
