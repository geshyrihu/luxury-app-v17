import { Routes } from '@angular/router';

export default [
  {
    path: 'menu-movil',
    loadComponent: () =>
      import('src/app/layouts/menu-celular/menu-celular.component'),
    title: 'Inventario',
  },
] as Routes;
