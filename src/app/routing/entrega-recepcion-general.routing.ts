import { Routes } from '@angular/router';

export default [
  {
    path: 'descripcion',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/entrega-recepcion/list-catalogo-descripcion/list-catalogo-descripcion.component'
      ),
  },
  {
    path: 'general',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
  {
    path: 'contable',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
  {
    path: 'operaciones',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
  {
    path: 'legal',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
] as Routes;
