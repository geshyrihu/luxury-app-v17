import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export default [
  {
    path: '',
    loadComponent: () => import('src/app/pages/dashboard/dashboard.component'),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' },
  },
  {
    path: 'dashboard',
    loadComponent: () => import('src/app/pages/dashboard/dashboard.component'),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' },
  },
  {
    path: 'catalog',
    loadChildren: () => import('./catalog.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Catalog' },
  },

  {
    path: 'application-user',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/list-application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Application User' },
  },

  {
    path: 'contabilidad',
    loadChildren: () => import('./contabilidad.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Contabilidad' },
  },
  {
    path: 'supervision',
    loadChildren: () => import('./supervision.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Supervision' },
  },
  {
    path: 'mantenimiento',
    loadChildren: () => import('./mantenimiento.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Mantenimiento' },
  },
  {
    path: 'reclutamiento',
    loadChildren: () => import('./reclutamiento.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Reclutamiento' },
  },
  {
    path: 'operaciones',
    loadChildren: () => import('./operaciones.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Operaciones' },
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu-movil.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Menu' },
  },

  {
    path: 'documento',
    loadChildren: () => import('./documents.routing'),
    data: { title: 'Documento' },
  },
  {
    path: 'sistemas',
    loadChildren: () => import('./sistemas.routing'),
    data: { title: 'Sistemas' },
  },

  {
    path: 'utilidades',
    loadChildren: () => import('./utillidades.routing'),
    data: { title: 'Utilidades' },
  },

  {
    path: 'legal',
    loadChildren: () => import('./legal.routing'),
    data: { title: 'Legal' },
  },

  // Nuevas rutas validadas

  // Rutas con hijos
  {
    path: 'tickets',
    loadChildren: () => import('src/app/routing/tickets.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Luxury Chat' },
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Settings' },
  },
  {
    path: 'report',
    loadChildren: () => import('src/app/routing/report.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Reportes' },
  },
  // {
  //   path: 'report',
  //   loadChildren: () => import('./finales/report.routing'),
  //   data: { title: 'Reporte' },
  // },
  {
    path: 'almacen',
    loadChildren: () => import('./almacen.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Almacén' },
  },

  {
    path: 'calendars',
    loadChildren: () => import('./calendars.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Calendario' },
  },

  {
    path: 'logbook',
    loadChildren: () => import('./logbook.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Bitácora' },
  },
  {
    path: 'entrega-recepcion',
    loadChildren: () => import('./entrega-recepcion.routing'),
    canActivate: [AuthGuard],
  },
  // Rutas directas
  {
    path: 'directory',
    loadChildren: () => import('./directory.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Directorio' },
  },
  {
    canActivate: [AuthGuard],
    path: 'accounts',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/list-application-user/list-application-user.component'
      ),
    title: 'Cuentas de Acceso',
    data: { title: 'Cuentas de Acceso' },
  },
  {
    path: 'update-user-profile',
    loadComponent: () =>
      import(
        'src/app/pages/application-user/update-profile/update-profile.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Actualizar Perfil' },
  },

  {
    path: 'movil-options',
    loadComponent: () =>
      import(
        'src/app/layouts/cell-phone-option/cell-phone-menu/cell-phone-menu.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Actualizar Perfil' },
  },
] as Routes;
