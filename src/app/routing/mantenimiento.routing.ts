import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'calendario-anual',
    loadComponent: () =>
      import(
        'src/app/pages/calendar/mantenimiento-preventivo/list-calendario-mtto.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Calendario Anual' },
  },
] as Routes;
