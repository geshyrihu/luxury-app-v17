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
        routerLink: '/operaciones/compras/cedula-cliente',
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
        routerLink: '/operaciones/compras/presupuestos',
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
        routerLink: '/operaciones/compras/mtto-presupuesto',
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
        routerLink: '/catalog/products-services',
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
        routerLink: '/operaciones/compras/solicitudes-compra',
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
        routerLink: '/operaciones/compras/ordenes-compra-fijos',
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
        routerLink: '/operaciones/compras/ordenes-compra',
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
        routerLink: '/operaciones/compras/catalogo-gastos-fijos',
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
        routerLink: '/operaciones/compras/pagadas',
        name: 'Compras-ordenes de compra pagadas',
      },
    ],
  },
];
