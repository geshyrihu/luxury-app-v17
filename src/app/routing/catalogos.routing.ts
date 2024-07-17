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
      import('src/app/pages/inventario-extintor/inventario-extintor.component'),
  },
  {
    path: 'extintores-group',
    loadComponent: () =>
      import(
        'src/app/pages/inventario-extintor/inventario-extintor-group.component'
      ),
  },
  {
    path: 'iluminacion',
    loadComponent: () =>
      import(
        'src/app/pages/inventario-iluminacion/inventario-iluminacion.component'
      ),
  },
  {
    path: 'pintura',
    loadComponent: () =>
      import('src/app/pages/inventario-pintura/inventario-pintura.component'),
  },
] as Routes;
