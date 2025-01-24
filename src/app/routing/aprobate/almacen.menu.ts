import { AuthService } from 'src/app/core/services/auth.service';

export const almacenMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
    ]),
    label: 'Almacén',
    icon: 'fa-duotone fa-solid fa-boxes-stacked',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Inventario productos',
        routerLink: '/almacen/inventario-productos',
        name: 'Inventarios-Entradas de insumos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Entradas de insumos',
        routerLink: '/almacen/entrada-productos',
        name: 'Inventarios-Entradas de insumos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Salidas de insumos',
        routerLink: '/almacen/salida-productos',
        name: 'Inventarios-Salida de insumos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Préstamo de herramientas',
        routerLink: '/almacen/prestamo-herramienta',
        name: 'Inventarios-Préstamo de herramientas',
      },
    ],
  },
];
