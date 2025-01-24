import { Routes } from '@angular/router';

export default [
  {
    path: 'inventario-productos',
    title: 'Inventario Productos',
    data: { title: 'Inventario Productos' },
    loadComponent: () =>
      import(
        'src/app/pages/inventarios/inventario-productos/list-almacen-productos.component'
      ),
  },
  {
    path: 'salida-productos',
    title: 'Salida productos',
    data: { title: 'Salida productos' },
    loadComponent: () =>
      import('src/app/pages/almacen/salida-producto/list-salidas.component'),
  },
  {
    path: 'entrada-productos',
    title: 'Entrada de productos',
    data: { title: 'Entrada de productos' },
    loadComponent: () =>
      import('src/app/pages/almacen/entrada-producto/list-entradas.component'),
  },
  {
    path: 'prestamo-herramienta',
    title: 'Prestamo de Herramientas',
    data: { title: 'Prestamo de Herramientas' },
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/prestamo-herramienta/control-prestamo-herramientas.component'
      ),
  },
] as Routes;
