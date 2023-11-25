import { Routes } from '@angular/router';

export default [
  {
    path: 'maintenance',
    loadComponent: () =>
      import('src/app/shared/extrapages/maintenance/maintenance.component'),
  },
  {
    path: 'coming-soon',
    loadComponent: () =>
      import('src/app/shared/extrapages/comingsoon/comingsoon.component'),
  },
  {
    path: '404',
    loadComponent: () =>
      import('src/app/shared/extrapages/page404/page404.component'),
  },
  {
    path: '500',
    loadComponent: () =>
      import('src/app/shared/extrapages/page500/page500.component'),
  },
] as Routes;
