import { Routes } from '@angular/router';

export default [
  {
    path: 'panel',
    loadComponent: () =>
      import('src/app/pages/tickets-v2/ticket-panel/ticket-panel.component'),
  },
  {
    path: 'line-time/:year/:week',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/line-time-operation-report/line-time-operation-report.component'
      ),
  },
  {
    path: ':departament',
    loadComponent: () =>
      import(
        'src/app/pages/tickets-v2/list-ticket-for-departament/list-ticket-for-departament.component'
      ),
  },
] as Routes;
