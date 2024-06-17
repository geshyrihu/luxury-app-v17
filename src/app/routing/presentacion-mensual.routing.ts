import { Routes } from '@angular/router';

export default [
  {
    path: 'presentaciones',
    loadComponent: () =>
      import(
        'src/app/pages/presentacion-junta-comite/presentacion-junta-comite.component'
      ),
  },
] as Routes;
