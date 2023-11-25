import { Routes } from '@angular/router';

export default [
  {
    path: 'calcular-iva',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/utilidades/calculadoras/calculadoras.component'
      ),
  },
] as Routes;
