import { AuthService } from 'src/app/core/services/auth.service';

export const reclutamientoMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('7.1 RECLUTAMIENTO'),
    label: '7.1 Reclutamiento',
    icon: 'fa-duotone fa-solid fa-arrows-down-to-people',
    items: [
      {
        visible: authS.canRead('7.1.1 RECLUTAMIENTOPLANTILLA'),
        label: '7.1.1 Plantilla interna',
        routerLink: '/reclutamiento/plantilla-interna',
        name: 'Reclutamiento-Plantilla',
      },
      {
        visible: authS.canRead('7.1.1 RECLUTAMIENTOPLANTILLA'),
        label: '7.1.2 Solicitudes (cliente)',
        routerLink: '/reclutamiento/solicitudes_cliente',
        name: 'Reclutamiento-Solicitudes por cliente',
      },
      {
        visible: authS.canRead('7.1 RECLUTAMIENTO'),
        label: '7.1.3 Solicitudes (Gral)',
        routerLink: '/reclutamiento/solicitudes/vacantes',
        name: 'Reclutamiento-Solicitudes a reclutamiento',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '7.1.4 Reporte solicitudes',
        routerLink: '',
        name: 'Reclutamiento-Profesiones',
      },
    ],
  },
];
