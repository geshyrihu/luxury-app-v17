import { Routes } from '@angular/router';

export default [
  {
    path: 'reporte-pdf',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/sistemas/sistemas-reporte-pdf/sistemas-reporte-pdf.component'
      ),
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/sistemas/sistemas-reporte/sistemas-reporte.component'
      ),
  },
] as Routes;
