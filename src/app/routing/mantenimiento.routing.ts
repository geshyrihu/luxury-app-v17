import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'calendario-anual',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/calendarios/mantenimiento-preventivo/list-calendario-mtto.component'
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'almacen',
    loadChildren: () => import('./almacen.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'bitacora',
    loadChildren: () => import('./bitacora.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./catalogos.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'inventario',
    loadChildren: () => import('./inventarios.routing'),
    canActivate: [AuthGuard],
  },
] as Routes;
