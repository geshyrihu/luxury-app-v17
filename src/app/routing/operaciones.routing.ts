import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'entrega-recepcion',
    loadChildren: () => import('./entrega-recepcion.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'calendario',
    loadChildren: () => import('./calendarios.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'reporte',
    loadChildren: () => import('./ticket.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'junta-comite',
    loadChildren: () => import('./juntas-comite.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'presentacion-junta-comite',
    loadChildren: () => import('./presentacion-mensual.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'compras',
    loadChildren: () => import('./compras.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'mi-edificio',
    loadComponent: () =>
      import('src/app/pages/operaciones/mi-edificio/mi-edificio.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'reportes-mantenimiento',
    loadChildren: () => import('./mantenimiento-reportes.routing'),
    canActivate: [AuthGuard],
  },
] as Routes;
