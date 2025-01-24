import { AuthService } from 'src/app/core/services/auth.service';

export const legalMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
    label: 'Legal',
    icon: 'fa-duotone fa-solid fa-gavel',
    items: [
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Pendientes de Minutas',
        routerLink: '/legal/pendientes-minutas-legal',
        name: 'Pendientes de Minutas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Listado de Tickets',
        routerLink: '/legal/list-ticket-legal',
        name: 'Listado de Tickets',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Reporte general de pendientes',
        routerLink: '/legal/pendings',
        name: 'Reporte general de pendientes',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Reporte interno',
        routerLink: '/legal/reports-internal',
        name: 'Reporte interno',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Reporte externo',
        routerLink: '/legal/reports-external',
        name: 'Reporte externo',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Directorio de comites',
        routerLink: '/legal/directorio-comites',
        name: 'Directorio de comites',
      },
      // {
      //   visible: authS.canRead('SuperUsuario'),
      //   label: 'Contratos y Polizas',
      //   routerLink: '/documento/contracts-policies-view-legal',
      //   name: 'polizas',
      // },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Catalogo de Asuntos Legales',
        routerLink: '/legal/legal-matter',
        name: 'Catalogo de Asuntos Legales',
      },
    ],
  },
];
