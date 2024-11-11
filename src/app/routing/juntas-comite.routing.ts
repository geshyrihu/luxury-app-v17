import { Routes } from '@angular/router';

export default [
  {
    path: 'minutas',
    loadComponent: () =>
      import(
        'src/app/pages/5.1-operaciones/junta-comite/list-minutas.component'
      ),
    data: {
      title: 'Listado de Minutas',
    },
  },
  {
    path: 'resumen-minuta/:meetingId',
    loadComponent: () =>
      import(
        'src/app/pages/5.1-operaciones/junta-comite/resumen-minuta/resumen-minuta.component'
      ),
    data: {
      title: 'Resumen de Minuta',
    },
  },
  {
    path: 'minuta-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/5.1-operaciones/junta-comite/minuta-pendientes/minuta-pendientes.component'
      ),
    data: {
      title: 'Minutas Pendientes',
    },
  },
  {
    path: 'seguimiento-minutas/:area',
    loadComponent: () =>
      import(
        'src/app/pages/5.1-operaciones/junta-comite/seguimiento-minutas/seguimiento-minutas.component'
      ),
    data: {
      title: 'Seguimiento de Minutas',
    },
  },
] as Routes;
