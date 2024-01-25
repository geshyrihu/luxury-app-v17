import { Routes } from '@angular/router';

export default [
  {
    path: 'panel',
    loadComponent: () =>
      import('src/app/pages/ticket-panel/ticket-panel.component'),
  },
  {
    path: 'line-time/:year/:week',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/line-time-operation-report/line-time-operation-report.component'
      ),
  },
] as Routes;
