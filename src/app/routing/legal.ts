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
        routerLink: '/contabilidad/pendientes-minutas-legal',
        name: 'Legal-Minutas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Listado de Tickets',
        routerLink: '/legal/list-ticket-legal',
        name: 'Tickets',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Reporte general de pendientes',
        routerLink: '/legal/pendings',
        name: 'pendientes legal',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Reporte interno',
        routerLink: '/legal/reports-internal',
        name: 'reportes legal',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Reporte externo',
        routerLink: '/legal/reports-external',
        name: 'reportes legal',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Directorio de comites',
        routerLink: '/legal/comites',
        name: 'comites',
      },
      {
        visible: authS.canRead('SuperUsuario'),
        label: 'Contratos y Polizas',
        routerLink: '/documento/contracts-policies-view-legal',
        name: 'polizas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario', 'Legal']),
        label: 'Categorias y asuntos',
        routerLink: '/legal/legal-matter',
        name: 'reportes legal',
      },
    ],
  },
];
