import { AuthService } from 'src/app/core/services/auth.service';

export const inventariosMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.9 INVENTARIOS'),
    label: '5.9 Inventarios',
    icon: 'fa-duotone fa-solid fa-store',
    items: [
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.1 Amenidades',
        routerLink: '/mantenimiento/inventario/equipos/2',
        name: 'Inventarios-Equipos',
      },

      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.2 Áreas Comunes',
        routerLink: '/mantenimiento/inventario/equipos/8',
        name: 'Inventarios-Areas comunes',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.3 Cuartos de Maquinas',
        routerLink: '/mantenimiento/inventario/equipos/7',
        name: 'Inventarios-Cuartos de maquinas',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.4 Mobiliario',
        routerLink: '/mantenimiento/inventario/equipos/3',
        name: 'Inventarios-Mobiliarios',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.5 Llaves',
        routerLink: '/mantenimiento/inventario/llaves',
        name: 'Inventarios-Llaves',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.6 Herramientas',
        routerLink: '/mantenimiento/inventario/herramienta',
        name: 'Inventarios-Herramienta',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.7 Radios',
        routerLink: '/mantenimiento/inventario/radios',
        name: 'Inventarios-Radios',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.8 Compito y CCTV',
        routerLink: '/mantenimiento/inventario/equipos/6',
        name: 'Inventarios-Equipos de sistemas',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.9 Equipos electromecánicos',
        routerLink: '/mantenimiento/inventario/equipos/1',
        name: 'Inventarios-Equipos electromecanicos',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.10 Equipos de Gimnasio',
        routerLink: '/mantenimiento/inventario/equipos/5',
        name: 'Inventarios-Equipos de gimnasio',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.11 Extintores',
        routerLink: '/catalog/extintores',
        name: 'Inventarios-Extintores',
      },
      {
        visible: authS.canRead('5.9 INVENTARIOS'),
        label: '5.9.12 Extintores 2',
        routerLink: '/catalog/extintores-group',
        name: 'Inventarios-Extintores',
      },
    ],
  },
];
