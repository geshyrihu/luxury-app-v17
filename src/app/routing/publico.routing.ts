import { Routes } from '@angular/router';

export default [
  {
    path: 'reporte-operacion/:customer/:inicio/:final',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/report-client/report-client.component'
      ),
  },
  {
    path: 'operation-report-client/:customer/:inicio/:final',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/operation-report-client/operation-report-client.component'
      ),
  },
  {
    path: 'reporte-minuta/:customer/:id',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/report-meeting/report-meeting.component'
      ),
  },
  {
    path: 'reporte-ticket-pendientes-proveedor/:customerId/:departamentId',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/reporte-ticket-pendientes-proveedor/reporte-ticket-pendientes-proveedor.component'
      ),
  },
] as Routes;
