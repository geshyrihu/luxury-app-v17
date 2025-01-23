import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: '',
    loadComponent: () => import('src/app/pages/home/home.component'),
    canActivate: [AuthGuard],
    data: { title: 'Inicio' },
  },
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
    path: 'contabilidad',
    loadChildren: () => import('./contabilidad.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Contabilidad' },
  },
  {
    path: 'dashboard',
    loadComponent: () => import('src/app/pages/dashboard/dashboard.component'),
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' },
  },
  {
    path: 'directory',
    loadChildren: () => import('./directory.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Directorio' },
  },
  {
    path: 'documento',
    loadChildren: () => import('./documents.routing'),
    data: { title: 'Documento' },
  },
  {
    path: 'entrega-recepcion',
    loadChildren: () => import('./entrega-recepcion.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('src/app/pages/home/home.component'),
    canActivate: [AuthGuard],
    data: { title: 'Inicio' },
  },
  {
    path: 'home-anuncios',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-anuncios.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-attendance',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-attendance.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-bitacoras',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-bitacoras.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-calendar',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-calendar.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-calendar-juntas-comite',
    loadComponent: () =>
      import(
        'src/app/pages/home/jefe-mantenimiento/home-calendar-juntas-comite.component'
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-compras',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-compras.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-directorios',
    loadComponent: () =>
      import(
        'src/app/pages/home/jefe-mantenimiento/home-directorios.component'
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-documents',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-documents.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-inspection',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-inspection.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-inventory',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-inventory.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-juntas-comite',
    loadComponent: () =>
      import(
        'src/app/pages/home/jefe-mantenimiento/home-juntas-comite.component'
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-notification',
    loadComponent: () =>
      import(
        'src/app/pages/home/jefe-mantenimiento/home-notification.component'
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-reports',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-reports.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-ticket',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-tickets.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'home-warehouses',
    loadComponent: () =>
      import('src/app/pages/home/jefe-mantenimiento/home-warehouses.component'),
    canActivate: [AuthGuard],
  },
  {
    path: 'inspections',
    loadChildren: () => import('./inspection.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Inspecciones' },
  },
  {
    path: 'legal',
    loadChildren: () => import('./legal.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Legal' },
  },
  {
    path: 'logbook',
    loadChildren: () => import('./logbook.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Bitácora' },
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu-movil.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Menu' },
  },
  {
    path: 'mantenimiento',
    loadChildren: () => import('./mantenimiento.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Mantenimiento' },
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
  {
    path: 'operaciones',
    loadChildren: () => import('./operaciones.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Operaciones' },
  },
  {
    path: 'reclutamiento',
    loadChildren: () => import('./reclutamiento.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Reclutamiento' },
  },
  {
    path: 'report',
    loadChildren: () => import('src/app/routing/report.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Reportes' },
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Configuración del sistema' },
  },
  {
    path: 'sistemas',
    loadChildren: () => import('./sistemas.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Sistemas' },
  },
  {
    path: 'supervision',
    loadChildren: () => import('./supervision.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Supervision' },
  },
  {
    path: 'tickets',
    loadChildren: () => import('src/app/routing/tickets.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Luxury Chat' },
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
    path: 'utilidades',
    loadChildren: () => import('./utillidades.routing'),
    canActivate: [AuthGuard],
    data: { title: 'Utilidades' },
  },
] as Routes;
