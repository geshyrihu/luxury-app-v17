import { Routes } from '@angular/router';

export default [
  {
    path: 'tiket-mantenimiento',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/list-ticket/list-ticket.component'
      ),
  },
  {
    path: 'reporte-concluidos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/reporte-terminados/reporte-operacion.component'
      ),
  },
  {
    path: 'reporte-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/tikets/reporte-pendientes/pending-report.component'
      ),
  },
] as Routes;
