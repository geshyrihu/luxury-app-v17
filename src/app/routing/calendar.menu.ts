import { AuthService } from 'src/app/core/services/auth.service';

export const calendarMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.11 CALENDARIOS'),
    label: '5.11 Calendarios',
    icon: 'fa-duotone fa-solid fa-calendar',
    items: [
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.1 Fondeos',
        routerLink: '/calendars/fondeos',
        name: 'Calendario-Fondeos',
      },
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.2 Reuniones con comité',
        routerLink: '/calendars/reuniones-comite',
        name: 'Calendario-Fondeos',
      },
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.3 Mtto preventivo',
        routerLink: '/mantenimiento/calendario-anual',
        name: 'Calendario-Mantenimiento preventivo',
      },
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.4 Mtto pintura',
        routerLink: '/mantenimiento/calendario-anual',
        name: 'Calendario-Mantenimiento preventivo',
      },
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.5 Cumpleaños',
        routerLink: '/calendars/cumpleanos',
        name: 'Calendario-Cumpleaños',
      },
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.6 Fiestas Judías',
        routerLink: '/calendars/fiestas-judias',
        name: 'Calendario-Fiestaws judias',
      },
      {
        visible: authS.canRead('5.11 CALENDARIOS'),
        label: '5.11.7 Fiestas Catolicas',
        routerLink: '/calendars/fiestas-cristianas',
        name: 'Calendario-Fiestaws catolicas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '5.11.7 Listado',
        routerLink: '/calendars/list',
        name: 'Calendario-Fiestaws catolicas',
      },
    ],
  },
];
