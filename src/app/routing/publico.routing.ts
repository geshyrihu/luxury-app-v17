import { Routes } from '@angular/router';

export default [
  {
    path: 'reporte-operacion/:customer/:inicio/:final',
    loadComponent: () =>
      import('src/app/pages/reportes/report-client/report-client.component'),
    data: { title: 'Reporte Operación' },
  },
  {
    path: 'operation-report-client/:customer/:inicio/:final',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/operation-report-client/operation-report-client.component'
      ),
    data: { title: 'Reporte Cliente Operación' },
  },
  {
    path: 'reporte-minuta/:customer/:id',
    loadComponent: () =>
      import('src/app/pages/reportes/report-meeting/report-meeting.component'),
    data: { title: 'Reporte de Minuta' },
  },
  {
    path: 'reporte-ticket-pendientes-proveedor/:customerId/:departamentId',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/reporte-ticket-pendientes-proveedor/reporte-ticket-pendientes-proveedor.component'
      ),
    data: { title: 'Reporte de Tickets Pendientes Proveedor' },
  },
] as Routes;
