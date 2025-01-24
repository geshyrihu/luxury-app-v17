import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'mi-edificio',
    loadComponent: () =>
      import('src/app/pages/mi-edificio/mi-edificio.component'),
    canActivate: [AuthGuard],
    data: { title: 'Mi Edificio' },
  },
] as Routes;
