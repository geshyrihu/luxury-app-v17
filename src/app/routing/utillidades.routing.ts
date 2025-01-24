import { Routes } from '@angular/router';

export default [
  {
    path: 'calcular-iva',
    loadComponent: () =>
      import('src/app/pages/utilidades/calculadoras.component'),
    data: { title: 'Calcular IVA' },
  },
] as Routes;
