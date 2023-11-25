import { Routes } from '@angular/router';

export default [
  {
    path: 'fiestas-judias',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/calendarios/fiestas-judias/fiestas-judias.component'
      ),
    title: 'Fiestas judias',
  },
  {
    path: 'fiestas-cristianas',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/calendarios/fiestas-cristianas/fiestas-cristianas.component'
      ),
    title: 'Fiestas cristianas',
  },
  {
    path: 'cumpleanos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/calendarios/cumpleanos/birthday.component'
      ),
    title: 'Fiestas Cumpleaños',
  },
  {
    path: 'mantenimiento-master',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/capacitaciones/maintenance-calendar-master/calendario-maestro.component'
      ),
  },
  {
    path: 'fondeos',
    loadComponent: () =>
      import('src/app/pages/operaciones/calendarios/fondeos/fondeos.component'),
  },
  {
    path: 'calendario-maestro-equipo',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/capacitaciones/maintenance-calendar-master/calendario-maestro-equipo/calendario-maestro-equipo.component'
      ),
  },
] as Routes;
