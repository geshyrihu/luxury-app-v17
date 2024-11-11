import { Routes } from '@angular/router';

export default [
  {
    path: 'fiestas-judias',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/fiestas-judias/fiestas-judias.component'
      ),
    title: 'Fiestas Judías',
    data: { title: 'Fiestas Judías' },
  },
  {
    path: 'fiestas-cristianas',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/fiestas-cristianas/fiestas-cristianas.component'
      ),
    title: 'Fiestas Cristianas',
    data: { title: 'Fiestas Cristianas' },
  },
  {
    path: 'cumpleanos',
    loadComponent: () =>
      import('src/app/pages/5.6-calendar/cumpleanos/birthday.component'),
    title: 'Fiestas Cumpleaños',
    data: { title: 'Fiestas Cumpleaños' },
  },
  {
    path: 'mantenimiento-master',
    loadComponent: () =>
      import(
        'src/app/pages/5.5-capacitacion/maintenance-calendar-master/calendario-maestro.component'
      ),
    title: 'Mantenimiento Maestro', // Añadido título
    data: { title: 'Mantenimiento Maestro' },
  },
  {
    path: 'fondeos',
    loadComponent: () =>
      import('src/app/pages/5.6-calendar/fondeos/fondeos.component'),
    title: 'Fondeos', // Añadido título
    data: { title: 'Fondeos' },
  },
  {
    path: 'calendario-maestro-equipo',
    loadComponent: () =>
      import(
        'src/app/pages/5.5-capacitacion/maintenance-calendar-master/calendario-maestro-equipo/calendario-maestro-equipo.component'
      ),
    title: 'Calendario Maestro Equipo', // Añadido título
    data: { title: 'Calendario Maestro Equipo' },
  },
  {
    path: 'custom-calendar-events',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/custom-calendar/custom-calendar-events/custom-calendar-events.component'
      ),
    title: 'Eventos Personalizados del Calendario', // Añadido título
    data: { title: 'Eventos Personalizados del Calendario' },
  },
] as Routes;
