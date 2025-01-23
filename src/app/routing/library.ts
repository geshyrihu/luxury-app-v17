import { AuthService } from 'src/app/core/services/auth.service';

export const libraryMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.10 BIBLIOTECA'),
    label: '5.10 Biblioteca',
    icon: 'ffa-duotone fa-solid fa-books',
    name: 'Bliblioteca',
    items: [
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.1 Polizas de Mtto',
        routerLink: '/documento/poliza',
        name: 'Inventarios-Polizas de mantenimiento',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.2 Documentos',
        routerLink: '/documento/documento',
        name: 'Inventarios-Documentos',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.3 Manuales y procesos',
        routerLink: '/documento/procesos',
        name: 'Capacitación-Manuales y procesos',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.4 Formatos',
        routerLink: '/documento/formatos',
        name: 'Capacitación-Formatos',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.5 Comunicados internos',
        routerLink: '/documento/comunicado',
        name: 'Capacitación-Comunicados internos',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.6 Guia mttos preventivos',
        routerLink: '/calendars/mantenimiento-master',
        name: 'Calendario-Mantenimientos preventivos',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.7 Catalogo luminación',
        routerLink: '/catalog/iluminacion',
        name: 'Inventarios-Catalogo de iluminación',
      },
      {
        visible: authS.canRead('5.10 BIBLIOTECA'),
        label: '5.10.8 Catalogo pintura',
        routerLink: '/catalog/pintura',
        name: 'Inventarios-Catalogo de pintura',
      },
    ],
  },
];
