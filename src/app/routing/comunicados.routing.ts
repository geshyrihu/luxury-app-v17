import { Routes } from '@angular/router';

export default [
  {
    path: 'enviar-comunicado',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/enviar-email/enviar-comunicado/enviar-comunicado.component'
      ),
  },
] as Routes;
