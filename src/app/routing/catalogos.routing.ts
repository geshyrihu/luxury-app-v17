import { Routes } from '@angular/router';

export default [
  {
    path: 'extintores',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-extintor/inventario-extintor.component'
      ),
  },
  {
    path: 'extintores-group',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-extintor/inventario-extintor-group.component'
      ),
  },
  {
    path: 'iluminacion',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-iluminacion/inventario-iluminacion.component'
      ),
  },
  {
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-pintura/inventario-pintura.component'
      ),
  },
] as Routes;
