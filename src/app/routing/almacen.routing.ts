import { Routes } from '@angular/router';

export default [
  {
    path: 'inventario-productos',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-productos/list-almacen-productos.component'
      ),
    title: 'Inventario',
  },
  {
    path: 'salida-productos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-almacen/salidas/list-salidas.component'
      ),
    title: 'Salida de inventario',
  },
  {
    path: 'entrada-productos',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/almacenes/entrada-producto/list-entradas.component'
      ),
    title: 'Entrada de inventario',
  },
] as Routes;
