import { AuthService } from 'src/app/core/services/auth.service';

export const legalMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('2.1 LEGAL'),
    label: '2.1 Legal',
    icon: 'fa-duotone fa-solid fa-gavel',
    items: [
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.1 Minutas',
        routerLink: '/contabilidad/pendientes-minutas-legal',
        name: 'Legal-Minutas',
      },
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.2 Legal Tickets',
        routerLink: '/legal/list-ticket-legal',
        name: 'Tickets',
      },
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.3 Reporte pendientes',
        routerLink: '/legal/pendings',
        name: 'pendientes legal',
      },
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.4 Reporte interno',
        routerLink: '/legal/reports-internal',
        name: 'reportes legal',
      },
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.5 Reporte externo',
        routerLink: '/legal/reports-external',
        name: 'reportes legal',
      },
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.6 Directorio de comites',
        routerLink: '/directory/comites',
        name: 'comites',
      },
      {
        visible: authS.canRead('SuperUsuario'),
        label: '2.1.8 Contratos y Polizas',
        routerLink: '/documento/contracts-policies-view-legal',
        name: 'polizas',
      },
      {
        visible: authS.canRead('2.1 LEGAL'),
        label: '2.1.9 Categorias y asuntos',
        routerLink: '/legal/legal-matter',
        name: 'reportes legal',
      },
    ],
  },
];
