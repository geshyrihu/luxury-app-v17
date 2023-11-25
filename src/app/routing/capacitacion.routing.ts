import { Routes } from '@angular/router';

export default [
  {
    path: 'nomenclatura',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/capacitaciones/nomenclatura/nomenclatura.component'
      ),
  },
  {
    path: 'comunicado',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/capacitaciones/comunicado/comunicado.component'
      ),
  },
  {
    path: 'formatos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/capacitaciones/formato/formato.component'
      ),
  },
  {
    path: 'procesos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/capacitaciones/proceso/proceso.component'
      ),
  },
] as Routes;
