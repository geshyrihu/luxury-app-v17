import { Routes } from '@angular/router';

export default [
  {
    path: 'inventario-productos',
    title: 'Inventario Insumos',
    data: { title: 'Inventario Insumos' }, // Cambiado a objeto
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-productos/list-almacen-productos.component'
      ),
  },
  {
    path: 'salida-productos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-almacen/salidas/list-salidas.component'
      ),
    title: 'Salida de Inventario', // Se mantiene la propiedad title
    data: { title: 'Salida de Inventario' },
  },
  {
    path: 'entrada-productos',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/almacenes/entrada-producto/list-entradas.component'
      ),
    title: 'Entrada de Inventario', // Se mantiene la propiedad title
    data: { title: 'Entrada de Inventario' },
  },
  {
    path: 'prestamo-herramienta',

    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/prestamo-herramienta/control-prestamo-herramientas.component'
      ),
    title: 'Prestamo de Herramientas',
    data: { title: 'Prestamo de Herramientas' },
  },
] as Routes;
