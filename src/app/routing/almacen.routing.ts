import { Routes } from '@angular/router';

export default [
  {
    path: 'inventario-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/inventario-productos/list-almacen-productos.component'
      ),
    title: 'Inventario',
  },
  {
    path: 'salida-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/salidas/list-salidas.component'
      ),
    title: 'Salida de inventario',
  },
  {
    path: 'entrada-productos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-almacen/entradas/list-entradas.component'
      ),
    title: 'Entrada de inventario',
  },
] as Routes;
