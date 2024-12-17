// import { Routes } from '@angular/router';

// export default [] as Routes;
import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'access-history',
    loadComponent: () =>
      import('src/app/pages/0-settings/historial-acceso/access-log.component'),
    data: { title: 'Historial de Acceso' },
  },
  {
    path: 'maintenance-report',
    loadChildren: () => import('./maintenance-report.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'resumen-ordenes-servicio',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/service-order/resumen-ordenes-servicio/resumen-ordenes-servicio.component'
      ),
    data: { title: 'Resumen Órdenes de Servicio' },
  },

  {
    path: 'pending-minutes',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/pending-minutes/pending-minutes.component'
      ),
    data: { title: 'Reporte de minutas pendientes' },
  },
  {
    path: 'estados-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/estados-financieros/estados-financieros.component'
      ),
    data: { title: 'Reporte estados-financieros' },
  },
  // {
  //   path: 'maintenance-report',
  //   loadChildren: () => import('./mantenimiento.routing'),
  //   data: { title: 'Reportes de mantenimiento ' },
  // },
] as Routes;
