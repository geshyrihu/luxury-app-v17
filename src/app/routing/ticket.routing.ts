import { Routes } from '@angular/router';

export default [
  {
    path: 'tiket-mantenimiento',
    loadComponent: () =>
      import('src/app/pages/tickets-v2/list-ticket/list-ticket.component'),
  },
  {
    path: 'reporte-concluidos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/reporte-ticekt-terminados/reporte-operacion.component'
      ),
  },
  {
    path: 'reporte-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/reporte-ticket-pendientes/pending-report.component'
      ),
  },
  {
    path: 'tickets/:departament',
    loadComponent: () =>
      import(
        'src/app/pages/tickets-v2/list-ticket-for-departament/list-ticket-for-departament.component'
      ),
  },
] as Routes;
