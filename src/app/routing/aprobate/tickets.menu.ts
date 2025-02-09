import { AuthService } from 'src/app/core/services/auth.service';

export const ticketsMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
      'AuxiliarMantenimiento',
      'Seguridad',
      'Limpieza',
      'Jardineria',
    ]),
    label: 'Tickets',
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
        label: 'Grupos de trabajo',
        routerLink: '/tickets/groups-list',
        name: 'Grupos de trabajo',
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
          'Limpieza',
          'Jardineria',
        ]),
        label: 'Mis asignaciones',
        routerLink: '/tickets/my-assignments',
        name: 'my assignments',
      },
      {
        visible: true,
        label: 'Mis solicitudes',
        routerLink: '/tickets/my-requests',
        name: 'my request',
      },
    ],
  },
];
