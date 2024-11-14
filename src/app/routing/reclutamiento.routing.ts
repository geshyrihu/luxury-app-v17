import { Routes } from '@angular/router';

export default [
  {
    path: 'plantilla-interna',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/plantilla/list-plantilla-components/list-plantilla.component'
      ),
    data: { title: 'Plantilla Interna' },
  },
  {
    path: 'departamentos',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.8-departamento-de-trabajo/list-area-responsable.component'
      ),
    data: { title: 'Áreas Responsables' },
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/list-solicitudes/reclutamiento-solicitudes-router.component'
      ),
    loadChildren: () => import('./reclutamiento-solicitudes.routing'),
    data: { title: 'Solicitudes' },
  },
  {
    path: 'status-solicitud-baja',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/status-requests/status-request-dismissal/status-request-dismissal.component'
      ),
    data: { title: 'Status Solicitud Baja' },
  },
  {
    path: 'status-solicitud-modificacion-salario',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/status-requests/status-request-salary-modification/status-request-salary-modification.component'
      ),
    data: { title: 'Status Solicitud Modificación de Salario' },
  },
  {
    path: 'solicitudes_cliente',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/list-solicitudes-por-cliente/list-solicitudes-por-cliente.component'
      ),
    data: { title: 'Solicitudes por Cliente' },
  },
  {
    path: 'solicitudes-baja',
    loadComponent: () =>
      import(
        'src/app/pages/7.0-reclutamiento/list-solicitudes/list-solicitud-baja/list-solicitud-baja.component'
      ),
    data: { title: 'Solicitudes de Baja' },
  },
] as Routes;
