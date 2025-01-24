import { Routes } from '@angular/router';

export default [
  {
    path: 'fiestas-judias',
    loadComponent: () =>
      import('src/app/pages/calendar/fiestas-judias/fiestas-judias.component'),
    title: 'Fiestas Judías',
    data: { title: 'Fiestas Judías' },
  },
  {
    path: 'fiestas-cristianas',
    loadComponent: () =>
      import(
        'src/app/pages/calendar/fiestas-cristianas/fiestas-cristianas.component'
      ),
    title: 'Fiestas Cristianas',
    data: { title: 'Fiestas Cristianas' },
  },
  {
    path: 'cumpleanos',
    loadComponent: () =>
      import('src/app/pages/calendar/cumpleanos/birthday.component'),
    title: 'Fiestas Cumpleaños',
    data: { title: 'Fiestas Cumpleaños' },
  },
  {
    path: 'mantenimiento-master',
    loadComponent: () =>
      import(
        'src/app/pages/capacitacion/maintenance-calendar-master/calendario-maestro-list.component'
      ),
    title: 'Mantenimiento Maestro', // Añadido título
    data: { title: 'Mantenimiento Maestro' },
  },
  {
    path: 'fondeos',
    loadComponent: () =>
      import('src/app/pages/calendar/fondeos/fondeos.component'),
    title: 'Fondeos', // Añadido título
    data: { title: 'Fondeos' },
  },
  {
    path: 'calendario-maestro-equipo',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/calendario-maestro-equipo/calendario-maestro-equipo.component'
      ),
    title: 'Calendario Maestro Equipo', // Añadido título
    data: { title: 'Calendario Maestro Equipo' },
  },

  {
    path: 'reuniones-comite',
    loadComponent: () =>
      import(
        'src/app/pages/calendars/reuniones-comite/reuniones-comite.component'
      ),
  },
] as Routes;
