import { Routes } from '@angular/router';

export default [
  {
    path: 'calcular-iva',
    loadComponent: () =>
      import(
        'src/app/pages/6.2-utilidades/calculadoras/calculadoras.component'
      ),
  },
] as Routes;
