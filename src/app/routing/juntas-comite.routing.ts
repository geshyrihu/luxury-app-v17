import { Routes } from '@angular/router';

export default [
  {
    path: 'minutas',
    loadComponent: () =>
      import('src/app/pages/operaciones/junta-comite/list-minutas.component'),
  },
  {
    path: 'resumen-minuta/:meetingId',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/junta-comite/resumen-minuta/resumen-minuta.component'
      ),
  },
  // {
  //   path: 'minuta/:id',
  //   loadComponent: () =>
  //     import(
  //       'src/app/pages/operaciones/junta-comite/reporte-pdf/minuta-report.component'
  //     ),
  // },
  {
    path: 'minuta-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/junta-comite/minuta-pendientes/minuta-pendientes.component'
      ),
  },
  {
    path: 'seguimiento-minutas/:area',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/junta-comite/seguimiento-minutas/seguimiento-minutas.component'
      ),
  },
] as Routes;
