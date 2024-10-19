import { Routes } from '@angular/router';

export default [
  {
    path: 'general',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
  {
    path: 'contable',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
  {
    path: 'operaciones',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
  {
    path: 'legal',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
  },
] as Routes;
