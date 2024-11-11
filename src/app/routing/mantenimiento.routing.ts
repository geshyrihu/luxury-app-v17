import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'panel-inventories',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/panel-inventories/panel-inventories.component'
      ),
    data: { title: 'Panel de Inventarios' },
  },
  {
    path: 'calendario-anual',
    loadComponent: () =>
      import(
        'src/app/pages/5.6-calendar/mantenimiento-preventivo/list-calendario-mtto.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Calendario Anual' },
  },

  {
    path: 'inventario',
    loadChildren: () => import('./inventarios.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Inventario' },
  },
] as Routes;
