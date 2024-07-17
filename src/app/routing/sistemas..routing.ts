import { Routes } from '@angular/router';

export default [
  {
    path: 'ticket-sistemas',
    loadComponent: () =>
      import('src/app/pages/ticket-sistemas/list-ticket-sistemas.component'),
  },
  {
    path: 'ticket-sistemas-report',
    loadComponent: () =>
      import(
        'src/app/pages/ticket-sistemas/ticket-sistemas-report/ticket-sistemas-report.component'
      ),
  },
] as Routes;
