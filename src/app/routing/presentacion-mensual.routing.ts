import { Routes } from '@angular/router';

export default [
  {
    path: 'presentaciones',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/presentaciones-mensuales/presentacion-junta-comite.component'
      ),
  },
] as Routes;
