import { Routes } from '@angular/router';

export default [
  {
    path: 'menu-movil',
    loadComponent: () =>
      import(
        'src/app/layouts/cell-phone-option/cell-phone-menu/cell-phone-menu.component'
      ),
    data: { title: 'Menú Móvil' },
  },
  {
    path: 'sub-menu/:label',
    loadComponent: () =>
      import(
        'src/app/layouts/cell-phone-option/cell-phone-sub-menu/cell-phone-sub-menu.component'
      ),
    data: { title: 'Inventario' },
  },
] as Routes;
