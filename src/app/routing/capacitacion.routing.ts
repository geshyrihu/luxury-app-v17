import { Routes } from '@angular/router';

export default [
  {
    path: 'nomenclatura',
    loadComponent: () =>
      import(
        'src/app/pages/5.5-capacitacion/nomenclatura/nomenclatura.component'
      ),
  },
  {
    path: 'comunicado',
    loadComponent: () =>
      import('src/app/pages/5.5-capacitacion/comunicado/comunicado.component'),
  },
  {
    path: 'formatos',
    loadComponent: () =>
      import('src/app/pages/5.5-capacitacion/formato/formato.component'),
  },
  {
    path: 'procesos',
    loadComponent: () =>
      import('src/app/pages/5.5-capacitacion/proceso/proceso.component'),
  },
] as Routes;
