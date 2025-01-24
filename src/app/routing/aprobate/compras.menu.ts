import { AuthService } from 'src/app/core/services/auth.service';

export const comprasMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
    ]),
    label: 'Compras',
    icon: 'fa-duotone fa-solid fa-bag-shopping',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Presupuesto actual',
        routerLink: '//compras/cedula-cliente',
        name: 'Compras-Cedula presupuestal',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Presupuestos',
        routerLink: '/compras/presupuestos',
        name: 'Compras-Cedula presupuestal',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Presupuesto mtto',
        routerLink: '/compras/mtto-presupuesto',
        name: 'Compras-Cuentas Mtto',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Productos y servicios',
        routerLink: '/compras/products-services',
        name: 'Compras-Productos y servicios',
      },

      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Solicitud compra',
        routerLink: '/compras/solicitudes-compra',
        name: 'Compras-Solicitudes de compra',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'OC Fijos',
        routerLink: '/compras/ordenes-compra-fijos',
        name: 'Compras-ordenes de compra gastos fijos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'OC Variables',
        routerLink: '/compras/ordenes-compra',
        name: 'Compras-ordenes de compra gastos variables',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'Catalogo OC Fijos',
        routerLink: '/compras/catalogo-gastos-fijos',
        name: 'Compras-catalogo ordenes de compra gastos fijos',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: 'OC Pagadas',
        routerLink: '/compras/pagadas',
        name: 'Compras-ordenes de compra pagadas',
      },
    ],
  },
];
