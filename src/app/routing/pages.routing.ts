import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export default [
  {
    path: '',
    loadChildren: () => import('./dashboard.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'pages',
    loadChildren: () => import('./extrapages.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'catalog',
    loadChildren: () => import('./catalog.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'application-user',
    loadComponent: () =>
      import(
        'src/app/pages/0-settings/user-administration/list-application-user/list-application-user.component'
      ),
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
    path: 'settings',
    loadChildren: () => import('./settings.routing'),
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
    path: 'legal',
    loadChildren: () => import('./legal.routing'),
  },
  {
    path: 'tickets',
    loadChildren: () => import('src/app/routing/tickets.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'luxury-chat',
    loadChildren: () => import('src/app/routing/luxury-chat.routing'),
    canActivate: [AuthGuard],
  },
] as Routes;
