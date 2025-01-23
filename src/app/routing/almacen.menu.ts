import { AuthService } from 'src/app/core/services/auth.service';

export const almacenMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.8 ALMACEN'),
    label: '5.8 Almacén',
    icon: 'fa-duotone fa-solid fa-boxes-stacked',
    items: [
      {
        visible: authS.canRead('5.8 ALMACEN'),
        label: '5.8.1 Inventario productos',
        routerLink: '/almacen/inventario-productos',
        name: 'Inventarios-Entradas de insumos',
      },
      {
        visible: authS.canRead('5.8 ALMACEN'),
        label: '5.8.2 Entradas de insumos',
        routerLink: '/almacen/entrada-productos',
        name: 'Inventarios-Entradas de insumos',
      },
      {
        visible: authS.canRead('5.8 ALMACEN'),
        label: '5.8.3 Salidas de insumos',
        routerLink: '/almacen/salida-productos',
        name: 'Inventarios-Salida de insumos',
      },
      {
        visible: authS.canRead('5.8 ALMACEN'),
        label: '5.8.4 Préstamo de herramientas',
        routerLink: '/almacen/prestamo-herramienta',
        name: 'Inventarios-Préstamo de herramientas',
      },
    ],
  },
];
