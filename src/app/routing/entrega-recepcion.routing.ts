import { Routes } from '@angular/router';

export default [
  {
    path: 'equipos',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/equipos/equipos.component'
      ),
  },
  {
    path: 'instalaciones',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/instalaciones/instalaciones.component'
      ),
  },
  {
    path: 'herramientas',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/herramientas/herramientas.component'
      ),
  },
  {
    path: 'insumos',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/insumos/insumos.component'
      ),
  },
  {
    path: 'mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/mantenimientos/mantenimientos.component'
      ),
  },
  {
    path: 'organigrama',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/organigrama/organigrama.component'
      ),
  },
  // {
  //   path: 'planos',
  //   loadComponent: () =>
  //     import('../operaciones/entrega-recepcion/planos/planos.component'),
  // },
  {
    path: 'llaves',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/llaves/llaves.component'
      ),
  },
  {
    path: 'hidrantes',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/hidrantes/hidrantes.component'
      ),
  },
  {
    path: 'mantenimientos-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/mantenimientos-pendientes/mantenimientos-pendientes.component'
      ),
  },
] as Routes;
