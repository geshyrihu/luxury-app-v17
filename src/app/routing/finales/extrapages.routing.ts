import { Routes } from '@angular/router';

export default [
  {
    path: 'maintenance',
    loadComponent: () =>
      import('src/app/shared/extrapages/maintenance/maintenance.component'),
    data: {
      title: 'Mantenimiento',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'coming-soon',
    loadComponent: () =>
      import('src/app/shared/extrapages/comingsoon/comingsoon.component'),
    data: {
      title: 'Próximamente',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },

  {
    path: '500',
    loadComponent: () =>
      import('src/app/shared/extrapages/page500/page500.component'),
    data: {
      title: 'Error Interno del Servidor',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
] as Routes;
