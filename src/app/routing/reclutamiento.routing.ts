import { Routes } from '@angular/router';

export default [
  {
    path: 'plantilla-interna',
    title: 'Plantilla interna',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/plantilla/list-plantilla-components/list-plantilla.component'
      ),
  },

  {
    path: 'departamentos',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/area-responsable/list-area-responsable.component'
      ),
    title: 'Areas Responsables',
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/list-solicitudes/reclutamiento-solicitudes-router.component'
      ),
    loadChildren: () => import('./reclutamiento-solicitudes.routing'),
  },

  {
    path: 'status-solicitud-baja',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/status-requests/status-request-dismissal/status-request-dismissal.component'
      ),
  },
  {
    path: 'status-solicitud-modificacion-salario',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/status-requests/status-request-salary-modification/status-request-salary-modification.component'
      ),
  },
  {
    path: 'solicitudes_cliente',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/list-solicitudes-por-cliente/list-solicitudes-por-cliente.component'
      ),
  },
  {
    path: 'solicitudes-baja',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/list-solicitudes/list-solicitud-baja/list-solicitud-baja.component'
      ),
  },
] as Routes;
