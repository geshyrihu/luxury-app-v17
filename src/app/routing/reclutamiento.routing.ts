import { Routes } from '@angular/router';

export default [
  {
    path: 'plantilla-interna',
    loadComponent: () =>
      import('src/app/pages/reclutamiento/plantilla/list-plantilla.component'),
    data: { title: 'Plantilla Interna' },
  },
  {
    path: 'departamentos',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/departamento-de-trabajo/list-area-responsable.component'
      ),
    data: { title: 'Áreas Responsables' },
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/reclutamiento-solicitudes-router.component'
      ),
    loadChildren: () => import('./reclutamiento-solicitudes.routing'),
    data: { title: 'Solicitudes' },
  },
  {
    path: 'status-solicitud-baja',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/status-requests/status-request-dismissal/status-request-dismissal.component'
      ),
    data: { title: 'Status Solicitud Baja' },
  },
  {
    path: 'status-solicitud-modificacion-salario',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/status-requests/status-request-salary-modification/status-request-salary-modification.component'
      ),
    data: { title: 'Status Solicitud Modificación de Salario' },
  },
  {
    path: 'solicitudes_cliente',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes-por-cliente/list-solicitudes-por-cliente.component'
      ),
    data: { title: 'Solicitudes por Cliente' },
  },
  {
    path: 'solicitudes-baja',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/solicitud-baja/list-solicitud-baja.component'
      ),
    data: { title: 'Solicitudes de Baja' },
  },
] as Routes;
