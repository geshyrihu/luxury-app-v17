import { Routes } from '@angular/router';

export default [
  {
    path: 'list',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/directorios/proveedor/mis-proveedores/mis-proveedores.component'
      ),
  },
] as Routes;
