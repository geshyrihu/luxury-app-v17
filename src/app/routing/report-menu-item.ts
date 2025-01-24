import { AuthService } from 'src/app/core/services/auth.service';

export const reportMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('7.1 REPORTES'),
    label: 'Reportes',
    icon: 'fa-duotone fa-solid fa-file-chart-column',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
        ]),
        label: 'Reporte mensual mantenimiento',
        routerLink: '/report/maintenance-report/panel',
        name: 'Reporte mensual mantenimiento',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
        ]),
        label: 'Reporte Supervisión',
        routerLink: '/report/report-supervision',
        name: 'Reporte Supervisión',
      },
      {
        visible: authS.canRead('7.1 REPORTES'),
        label: '6.3.1 Cierre mensual mtto',
        routerLink: '/report/maintenance-report/panel',
        name: 'Reporte mensual mtto',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '6.3.2 Tickets operativos',
        routerLink: '/',
        name: 'access-history',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '6.3.3 Tickets mtto preventivo',
        routerLink: '/',
        name: 'access-history',
      },
      {
        visible: true,
        label: 'Tickets minutas',
        routerLink: '/report/pending-minutes',
        name: 'access-history',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '6.3.5 Tickets proyectos',
        routerLink: '/',
        name: '',
      },

      {
        visible: true,
        label: 'Envio edos financieros',
        routerLink: '/report/estados-financieros',
        name: '',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '6.3.7 Presentaciones JC',
        routerLink: '/',
        name: '',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '6.3.8 Historial de acceso',
        routerLink: '/report/access-history',
        name: '',
      },
    ],
  },
];
