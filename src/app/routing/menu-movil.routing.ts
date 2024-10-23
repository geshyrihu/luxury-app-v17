import { Routes } from '@angular/router';

export default [
  {
    path: 'menu-movil',
    loadComponent: () =>
      import(
        'src/app/layouts/cell-phone-option/cell-phone-menu/cell-phone-menu.component'
      ),
    title: 'menu-movil',
  },
  {
    path: 'sub-menu/:label',
    loadComponent: () =>
      import(
        'src/app/layouts/cell-phone-option/cell-phone-sub-menu/cell-phone-sub-menu.component'
      ),
    title: 'Inventario',
  },
] as Routes;
