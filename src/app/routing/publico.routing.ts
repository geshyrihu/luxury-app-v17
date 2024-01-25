import { Routes } from '@angular/router';

export default [
  {
    path: 'reporte-operacion/:customer/:inicio/:final',
    loadComponent: () =>
      import('src/app/pages/publico/report-client/report-client.component'),
  },
  {
    path: 'reporte-minuta/:customer/:id',
    loadComponent: () =>
      import('src/app/pages/publico/report-meeting/report-meeting.component'),
  },
  {
    path: 'reporte-ticket-pendientes-proveedor/:customerId/:departamentId',
    loadComponent: () =>
      import(
        'src/app/pages/publico/reporte-ticket-pendientes-proveedor/reporte-ticket-pendientes-proveedor.component'
      ),
  },
] as Routes;
