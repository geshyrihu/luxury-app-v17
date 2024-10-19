import { Routes } from '@angular/router';

export default [
  {
    path: 'fiestas-judias',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/fiestas-judias/fiestas-judias.component'
      ),
    title: 'Fiestas judias',
  },
  {
    path: 'fiestas-cristianas',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/fiestas-cristianas/fiestas-cristianas.component'
      ),
    title: 'Fiestas cristianas',
  },
  {
    path: 'cumpleanos',
    loadComponent: () =>
      import('src/app/pages/5.6-calendar/cumpleanos/birthday.component'),
    title: 'Fiestas Cumpleaños',
  },
  {
    path: 'mantenimiento-master',
    loadComponent: () =>
      import(
        'src/app/pages/5.5-capacitacion/maintenance-calendar-master/calendario-maestro.component'
      ),
  },
  {
    path: 'fondeos',
    loadComponent: () =>
      import('src/app/pages/5.6-calendar/fondeos/fondeos.component'),
  },
  {
    path: 'calendario-maestro-equipo',
    loadComponent: () =>
      import(
        'src/app/pages/5.5-capacitacion/maintenance-calendar-master/calendario-maestro-equipo/calendario-maestro-equipo.component'
      ),
  },
  {
    path: 'custom-calendar-events',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/custom-calendar/custom-calendar-events/custom-calendar-events.component'
      ),
  },
] as Routes;
