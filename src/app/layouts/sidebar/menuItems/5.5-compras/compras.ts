import { AuthService } from 'src/app/core/services/auth.service';

export const comprasMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.5 COMPRAS'),
    label: '5.5 Compras',
    icon: 'fa-duotone fa-solid fa-bag-shopping',
    items: [
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.1 Presupuesto actual',
        routerLink: '/operaciones/compras/cedula-cliente',
        name: 'Compras-Cedula presupuestal',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.2 Presupuestos',
        routerLink: '/operaciones/compras/presupuestos',
        name: 'Compras-Cedula presupuestal',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.3 Presupuesto mtto',
        routerLink: '/operaciones/compras/mtto-presupuesto',
        name: 'Compras-Cuentas Mtto',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.4 Productos y servicios',
        routerLink: '/catalog/products-services',
        name: 'Compras-Productos y servicios',
      },

      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.5 Solicitud compra',
        routerLink: '/operaciones/compras/solicitudes-compra',
        name: 'Compras-Solicitudes de compra',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.6 OC Fijos',
        routerLink: '/operaciones/compras/ordenes-compra-fijos',
        name: 'Compras-ordenes de compra gastos fijos',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.7 OC Variables',
        routerLink: '/operaciones/compras/ordenes-compra',
        name: 'Compras-ordenes de compra gastos variables',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.8 Catalogo OC Fijos',
        routerLink: '/operaciones/compras/catalogo-gastos-fijos',
        name: 'Compras-catalogo ordenes de compra gastos fijos',
      },
      {
        visible: authS.canRead('5.5 COMPRAS'),
        label: '5.5.9 OC Pagadas',
        routerLink: '/operaciones/compras/pagadas',
        name: 'Compras-ordenes de compra pagadas',
      },
    ],
  },
];
