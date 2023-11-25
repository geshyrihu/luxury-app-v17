import { Routes } from '@angular/router';

export default [
  {
    path: 'productos-servicios',
    loadComponent: () =>
      import('src/app/pages/configuracion/productos/list-productos.component'),
  },
  {
    path: 'extintores',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/extintor/inventario-extintor.component'
      ),
  },
  {
    path: 'iluminacion',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/iluminacion/inventario-iluminacion.component'
      ),
  },
  {
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/pintura/inventario-pintura.component'
      ),
  },
] as Routes;
