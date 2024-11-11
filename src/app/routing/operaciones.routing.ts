import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  // {
  //   path: 'reporte',
  //   loadChildren: () => import('./ticketV1.routing'),
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'mantenimiento-preventivo',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/service-order/ordenes-servicio.component'
      ),
    data: { title: 'Mantenimiento Preventivo' },
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
    loadChildren: () => import('./finales/compras.routing'),
    canActivate: [AuthGuard],
  },
  {
    path: 'mi-edificio',
    loadComponent: () =>
      import('src/app/pages/1.0-mi-edificio/mi-edificio.component'),
    canActivate: [AuthGuard],
    data: { title: 'Mi Edificio' },
  },
] as Routes;
