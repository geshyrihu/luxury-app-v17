import { Routes } from '@angular/router';

export default [
  {
    path: 'profesiones',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/professions/list-professions.component'
      ),
  },
  {
    path: 'agenda-entrevistas',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/agenda-entrevistas/agenda-entrevistas.component'
      ),
  },
  {
    path: 'plantilla-interna',
    title: 'Plantilla interna',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/plantilla/list-plantilla-components/list-plantilla.component'
      ),
  },

  {
    path: 'departamentos',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/area-responsable/list-area-responsable.component'
      ),
    title: 'Areas Responsables',
  },
  {
    path: 'candidatos-vacante/:positionRequestId',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/list-solicitud-vacantes/list-vacante-candidatos/list-vacante-candidatos.component'
      ),
    title: 'Candidatos para vacantes',
  },
  {
    path: 'solicitudes',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/reclutamiento-solicitudes-router.component'
      ),
    loadChildren: () => import('./reclutamiento-solicitudes.routing'),
  },
  {
    path: 'status-solicitud-vacante',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/status-requests/status-position-request/status-position-request.component'
      ),
  },
  {
    path: 'status-solicitud-baja',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/status-requests/status-request-dismissal/status-request-dismissal.component'
      ),
  },
  {
    path: 'status-solicitud-modificacion-salario',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/status-requests/status-request-salary-modification/status-request-salary-modification.component'
      ),
  },
  {
    path: 'candidatos',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-candidates/list-candidates.component'
      ),
  },
  {
    path: 'solicitudes_cliente',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes-por-cliente/list-solicitudes-por-cliente.component'
      ),
  },
] as Routes;
