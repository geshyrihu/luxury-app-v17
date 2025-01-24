import { AuthService } from 'src/app/core/services/auth.service';

export const calendarMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
    ]),
    label: '5.11 Calendarios',
    icon: 'fa-duotone fa-solid fa-calendar',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.10.6 Guia mttos preventivos',
        routerLink: '/calendars/mantenimiento-master',
        name: 'Calendario-Mantenimientos preventivos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.11.2 Reuniones con comité',
        routerLink: '/calendars/reuniones-comite',
        name: 'Calendario-Fondeos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.11.3 Mtto preventivo',
        routerLink: '/mantenimiento/calendario-anual',
        name: 'Calendario-Mantenimiento preventivo',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.11.4 Mtto pintura',
        routerLink: '/mantenimiento/calendario-anual',
        name: 'Calendario-Mantenimiento preventivo',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.11.5 Cumpleaños',
        routerLink: '/calendars/cumpleanos',
        name: 'Calendario-Cumpleaños',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.11.6 Fiestas Judías',
        routerLink: '/calendars/fiestas-judias',
        name: 'Calendario-Fiestaws judias',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.11.7 Fiestas Catolicas',
        routerLink: '/calendars/fiestas-cristianas',
        name: 'Calendario-Fiestaws catolicas',
      },
    ],
  },
];
