import { Routes } from '@angular/router';

export default [
  {
    path: 'ticket-sistemas',
    loadComponent: () =>
      import(
        'src/app/pages/4-sistemas/ticket-sistemas/list-ticket-sistemas.component'
      ),
    data: { title: 'Tickets Sistemas' },
  },
  {
    path: 'ticket-sistemas-report',
    loadComponent: () =>
      import(
        'src/app/pages/4-sistemas/ticket-sistemas/ticket-sistemas-report/ticket-sistemas-report.component'
      ),
    data: { title: 'Reporte de Tickets Sistemas' },
  },
] as Routes;
