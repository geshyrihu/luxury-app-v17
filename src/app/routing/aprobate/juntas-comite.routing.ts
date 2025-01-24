import { Routes } from '@angular/router';

export default [
  {
    path: 'presentaciones',
    loadComponent: () =>
      import(
        'src/app/pages/juntas-comite/presentacion-junta-comite/presentacion-junta-comite.component'
      ),
    data: { title: 'Presentaciones' },
  },
  {
    path: 'minutas',
    loadComponent: () =>
      import(
        'src/app/pages/juntas-comite/junta-comite-minutas/list-minutas.component'
      ),
    data: {
      title: 'Listado de Minutas',
    },
  },
  {
    path: 'resumen-minuta/:meetingId',
    loadComponent: () =>
      import(
        'src/app/pages/juntas-comite/junta-comite-minutas/resumen-minuta.component'
      ),
    data: {
      title: 'Resumen de Minuta',
    },
  },
  {
    path: 'minuta-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/juntas-comite/junta-comite-minutas/minuta-pendientes.component'
      ),
    data: {
      title: 'Minutas Pendientes',
    },
  },
  {
    path: 'seguimiento-minutas/:area',
    loadComponent: () =>
      import(
        'src/app/pages/juntas-comite/junta-comite-minutas/seguimiento-minutas.component'
      ),
    data: {
      title: 'Seguimiento de Minutas',
    },
  },
] as Routes;
