import { AuthService } from 'src/app/core/services/auth.service';

export const ticketsMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.3 TICKET'),
    label: '5.3 Tickets',
    icon: 'fa-duotone fa-solid fa-ticket',
    name: 'Tickets',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.3.1 Grupos',
        routerLink: '/tickets/list',
        name: 'groups',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
          'Seguridad',
          'Jardineria',
          'Limpieza',
        ]),
        label: '5.3.2 Mis tickets Asignados',
        routerLink: '/tickets/my-tickets',
        name: 'my assignments',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'AuxiliarMantenimiento',
          'Seguridad',
          'Jardineria',
          'Limpieza',
        ]),
        label: '5.3.3 Mis tickets solicitados',
        routerLink: '/tickets/my-requests',
        name: 'my request',
      },

      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '5.3.4 Reportes',
        routerLink: '/tickets/reports',
        name: 'message report',
      },
    ],
  },
];
