import { Routes } from '@angular/router';

export default [
  {
    path: 'catalog',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/inspections-list/inspections-list.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/inspection-details/inspection-details.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
  {
    path: 'inspection-report-list',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/inspection-report-list/inspection-report-list.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
  {
    path: 'my-inspection-list',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/bitacora/my-inspection-list/my-inspection-list.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
  {
    path: 'my-inspection',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/bitacora/my-inspection-ejecutar/my-inspection-ejecutar.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
] as Routes;
