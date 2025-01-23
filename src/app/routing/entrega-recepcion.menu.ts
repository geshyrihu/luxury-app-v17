import { AuthService } from 'src/app/core/services/auth.service';

export const entregaRecepcionMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('6.2 ENTREGARECEPCION'),
    label: '6.2 Entrega Recepción',
    icon: 'fa-duotone fa-solid fa-truck',
    items: [
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.1 General',
        routerLink: '/entrega-recepcion/general',
        name: 'Supervisión-Entrega recepción',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.2 Equipos',
        routerLink: '/entrega-recepcion/equipos',
        name: 'Supervisión-Entrega recepción-Equipos',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.3 Instalaciones',
        routerLink: '/entrega-recepcion/instalaciones',
        name: 'Supervisión-Entrega recepción-Instalaciones',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.4 Extintores',
        routerLink: '/entrega-recepcion/hidrantes',
        name: 'Supervisión-Entrega recepción-Hidrantes',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.5 Llaves',
        routerLink: '/entrega-recepcion/llaves',
        name: 'Supervisión-Entrega recepción-Llaves',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.6 Herramientas',
        routerLink: '/entrega-recepcion/herramientas',
        name: 'Supervisión-Entrega recepción-Herramientas',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.7 Mantenimientos',
        routerLink: '/entrega-recepcion/mantenimientos',
        name: 'Supervisión-Entrega recepción-Mantenimientos',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.8 Pendientes',
        routerLink: 'operaciones/entrega-recepcion/mantenimientos-pendientes',
        name: 'Supervisión-Entrega recepción-Pendientes',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.9 Organigrama',
        routerLink: '/entrega-recepcion/organigrama',
        name: 'Supervisión-Entrega recepción-Organigrama',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.10 Planos',
        routerLink: '/entrega-recepcion/planos',
        name: 'Supervisión-Entrega recepción-Planos',
      },
      {
        visible: authS.canRead('6.2 ENTREGARECEPCION'),
        label: '6.2.11 Insumos',
        routerLink: '/entrega-recepcion/insumos',
        name: 'Supervisión-Entrega recepción-Insumos',
      },
    ],
  },
];
