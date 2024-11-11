import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

export default [
  {
    path: '',
    loadChildren: () => import('./dashboard.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' },
  },

  {
    path: 'catalog',
    loadChildren: () => import('./finales/catalog.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Catalog' },
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' },
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
    loadChildren: () => import('./finales/contabilidad.routing'),
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
    loadChildren: () => import('./finales/menu-movil.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Menu' },
  },

  {
    path: 'report',
    loadChildren: () => import('./finales/report.routing'),
    data: { title: 'Reporte' },
  },
  {
    path: 'documento',
    loadChildren: () => import('./finales/documents.routing'),
    data: { title: 'Documento' },
  },
  {
    path: 'sistemas',
    loadChildren: () => import('./sistemas.routing'),
    data: { title: 'Sistemas' },
  },
  {
    path: 'entrega-recepcion',
    loadChildren: () => import('./desechar/entrega-recepcion-general.routing'),
    data: { title: 'Entrega y Recepción' },
  },
  {
    path: 'utilidades',
    loadChildren: () => import('./utillidades.routing'),
    data: { title: 'Utilidades' },
  },
  {
    path: 'capacitacion',
    loadChildren: () => import('./desechar/capacitacion.routing'),
    data: { title: 'Capacitación' },
  },
  {
    path: 'legal',
    loadChildren: () => import('./finales/legal.routing'),
    data: { title: 'Legal' },
  },
  // {
  //   path: 'tickets',
  //   loadChildren: () => import('src/app/routing/ticketV2.routing'),
  //   canActivate: [AuthGuard],
  //   data: { title: 'Tickets' },
  // },

  // Nuevas rutas validadas

  // Rutas con hijos
  {
    path: 'tickets',
    loadChildren: () => import('src/app/routing/finales/tickets.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Luxury Chat' },
  },
  {
    path: 'settings',
    loadChildren: () => import('./finales/settings.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Settings' },
  },
  {
    path: 'report',
    loadChildren: () => import('src/app/routing/finales/report.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Reportes' },
  },
  {
    path: 'almacen',
    loadChildren: () => import('./finales/almacen.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Almacén' },
  },

  {
    path: 'calendario',
    loadChildren: () => import('./finales/calendar.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Calendario' },
  },

  {
    path: 'logbook',
    loadChildren: () => import('./finales/logbook.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Bitácora' },
  },
  {
    path: 'entrega-recepcion',
    loadChildren: () => import('./finales/entrega-recepcion.routing'),
    canActivate: [AuthGuard],
  },
  // Rutas directas
  {
    path: 'directory',
    loadChildren: () => import('./finales/directory.routing'),
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
