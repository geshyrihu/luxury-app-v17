import { Routes } from '@angular/router';

export default [
  {
    path: 'catalog',
    title: 'Catalogo de inspections',
    data: { title: 'Catalogo de inspections' },
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/inspections-list/inspections-list.component'
      ),
  },
  {
    path: 'details/:id',
    title: 'Inspection detalle',
    data: { title: 'Inspection detalle' },
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/inspection-details/inspection-details.component'
      ),
  },
  {
    path: 'inspection-report-list',
    title: 'Inspection report list',
    data: { title: 'Inspections report list' },
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/inspection-report-list/inspection-report-list.component'
      ),
  },
  {
    path: 'my-inspection-list',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/bitacora/my-inspection-list/my-inspection-list.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
  {
    path: 'my-inspection',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/bitacora/my-inspection-ejecutar/my-inspection-ejecutar.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
] as Routes;
