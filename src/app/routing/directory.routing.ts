import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
export default [
  {
    path: 'proveedor',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/proveedor/dashboard-proveedor.component'
      ),
    data: { title: 'Proveedor' },
  },
  {
    path: 'condominos',
    loadComponent: () =>
      import('src/app/pages/directorios/condominos/condominos-list.component'),
    data: { title: 'Condominos' },
  },
  {
    path: 'propiedades',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/propiedades/propiedades-list.component'
      ),
    data: { title: 'Propiedades' },
  },
  {
    path: 'comite-vigilancia',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/comite-vigilancia/comite-vigilancia-list.component'
      ),
    data: { title: 'Comité de Vigilancia' },
  },
  {
    path: 'personal-interno',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/employee-internal/employee-list.component'
      ),
    data: { title: 'Personal Interno' },
  },
  {
    path: 'personal-externo',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/employee-external/employee-external-list.component'
      ),
    data: { title: 'Personal Externo' },
  },
  {
    path: 'empleado',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/employee-internal/employee-add-or-edit.component'
      ),
    data: { title: 'Empleado' },
  },
  {
    path: 'telefonos-emergencia',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/telefonos-emergencia/telefonos-emergencia.component'
      ),
    data: { title: 'Teléfonos de Emergencia' },
  },
  {
    path: 'organigrama-interno',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/organigrama-interno/organigrama-interno.component'
      ),
    data: { title: 'Organigrama Interno' },
  },
  {
    path: 'mis-proveedores',
    loadComponent: () =>
      import('src/app/pages/directorios/proveedor/mis-proveedores.component'),
    canActivate: [AuthGuard], // Se agregó canActivate aquí
    data: { title: 'Mis Proveedores' },
  },
] as Routes;
