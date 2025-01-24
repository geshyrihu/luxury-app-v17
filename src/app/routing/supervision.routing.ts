import { Routes } from '@angular/router';

export default [
  {
    path: 'agenda-supervision',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/agenda-supervision/agenda-supervision.component'
      ),
    data: { title: 'Agenda de Supervisión' },
  },
  {
    path: 'minutas-resumen',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/minutas-resumen/minutas-resumen.component'
      ),
    data: { title: 'Minutas Resumen' },
  },
  {
    path: 'reporte-tickets',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/reporte-tickets/reporte-tickets.component'
      ),
    data: { title: 'Reporte de Tickets' },
  },
  {
    path: 'grafico-resultado-general',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/resultado-general-grafico/resultado-general-grafico.component'
      ),
    data: { title: 'Gráfico Resultado General' },
  },
  {
    path: 'resultado-general-posicion',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/resultado-general-posicion/resultado-general-posicion.component'
      ),
    data: { title: 'Resultado General por Posición' },
  },
  {
    path: 'evaluacion-areas',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas.component'
      ),
    data: { title: 'Evaluación de Áreas' },
  },
  {
    path: 'resultado-general-dashboard',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/resultado-general-dashboard/resultado-general-dashboard.component'
      ),
    data: { title: 'Dashboard de Resultado General' },
  },
  {
    path: 'presentaciones-juntas-comite',
    loadComponent: () =>
      import(
        'src/app/pages/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.component'
      ),
    data: { title: 'Presentaciones de Juntas Comité' },
  },
] as Routes;
