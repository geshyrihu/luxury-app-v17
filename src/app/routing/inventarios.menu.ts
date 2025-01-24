import { AuthService } from 'src/app/core/services/auth.service';

export const inventariosMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
    ]),
    label: '5.9 Inventarios',
    icon: 'fa-duotone fa-solid fa-store',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.1 Amenidades',
        routerLink: '/inventario/equipos/2',
        name: 'Inventarios-Equipos',
      },

      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.2 Áreas Comunes',
        routerLink: '/inventario/equipos/8',
        name: 'Inventarios-Areas comunes',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.3 Cuartos de Maquinas',
        routerLink: '/inventario/equipos/7',
        name: 'Inventarios-Cuartos de maquinas',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.4 Mobiliario',
        routerLink: '/inventario/equipos/3',
        name: 'Inventarios-Mobiliarios',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.5 Llaves',
        routerLink: '/inventario/llaves',
        name: 'Inventarios-Llaves',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.6 Herramientas',
        routerLink: '/inventario/herramienta',
        name: 'Inventarios-Herramienta',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.7 Radios',
        routerLink: '/inventario/radios',
        name: 'Inventarios-Radios',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.8 Computo y CCTV',
        routerLink: '/inventario/equipos/6',
        name: 'Inventarios-Equipos de sistemas',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.9 Equipos electromecánicos',
        routerLink: '/inventario/equipos/1',
        name: 'Inventarios-Equipos electromecanicos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.10 Equipos de Gimnasio',
        routerLink: '/inventario/equipos/5',
        name: 'Inventarios-Equipos de gimnasio',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.11 Extintores',
        routerLink: '/inventario/extintores',
        name: 'Inventarios-Extintores',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '5.9.12 Extintores 2',
        routerLink: '/inventario/extintores-group',
        name: 'Inventarios-Extintores',
      },
    ],
  },
];
