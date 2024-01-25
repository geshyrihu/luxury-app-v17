import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export default [
  {
    path: 'pages',
    loadChildren: () => import('./extrapages.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./dashboard.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'inicio',
    loadChildren: () => import('./dashboard.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    loadChildren: () => import('./application-user.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./configuracion.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'contabilidad',
    loadChildren: () => import('./contabilidad.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'supervision',
    loadChildren: () => import('./supervision.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'mantenimiento',
    loadChildren: () => import('./mantenimiento.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'reclutamiento',
    loadChildren: () => import('./reclutamiento.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'operaciones',
    loadChildren: () => import('./operaciones.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu-movil.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'directorio',
    loadChildren: () => import('./directorio.routing'),
  },
  {
    path: 'reporte',
    loadChildren: () => import('./reporte.routing'),
  },
  {
    path: 'documento',
    loadChildren: () => import('./documento.routing'),
  },
  {
    path: 'sistemas',
    loadChildren: () => import('./sistemas..routing'),
  },
  {
    path: 'entrega-recepcion',
    loadChildren: () => import('./entrega-recepcion-general.routing'),
  },
  {
    path: 'utilidades',
    loadChildren: () => import('./utillidades.routing'),
  },
  {
    path: 'capacitacion',
    loadChildren: () => import('./capacitacion.routing'),
  },
  {
    path: 'comunicacion',
    loadChildren: () => import('./comunicados.routing'),
  },
  {
    path: 'legal',
    loadChildren: () => import('./legal.routing'),
  },
  {
    path: 'tickets',
    loadChildren: () => import('src/app/routing/tickets.routing'),
    canActivate: [AuthGuard],
  },
] as Routes;
