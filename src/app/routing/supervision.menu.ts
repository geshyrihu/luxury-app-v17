import { AuthService } from 'src/app/core/services/auth.service';

export const supervisionMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('6.1 SUPERVISION'),
    label: '6.1 Supervisión',
    icon: 'fa-duotone fa-solid fa-user-tie',
    items: [
      {
        visible: authS.canRead('6.1 SUPERVISION'),
        label: '6.1.1 Bitácora Diaria',
        routerLink: '/supervision/agenda-supervision',
        name: 'Supervisión-Bitacora Diaria',
      },
      {
        visible: authS.canRead('6.1 SUPERVISION'),
        label: 'Resultado General',
        routerLink: '/supervision/resultado-general-dashboard',
        name: 'Supervisión-Resultado General',
      },
      {
        visible: authS.canRead('6.1 SUPERVISION'),
        label: 'Reporte Presentaciones',
        routerLink: '/supervision/presentaciones-juntas-comite',
        name: 'Supervisión-Reporte presentaciónes juntas de comité',
      },
      {
        visible: authS.canRead('6.1 SUPERVISION'),
        label: 'Reporte Minutas',
        routerLink: '/supervision/minutas-resumen',
        name: 'Supervisión-Reporte minutas',
      },
      {
        visible: authS.canRead('6.1 SUPERVISION'),
        label: 'Reporte Ticket',
        routerLink: '/supervision/reporte-tickets',
        name: 'Supervisión-Reporte tickets',
      },
    ],
  },
];
