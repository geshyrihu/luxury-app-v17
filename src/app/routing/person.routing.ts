import { Routes } from '@angular/router';

export default [
  {
    path: 'list',
    loadComponent: () =>
      import(
        'src/app/pages/6.1-directorios/directorios/proveedor/mis-proveedores/mis-proveedores.component'
      ),
  },
] as Routes;
