import { Routes } from '@angular/router';

export default [
  {
    path: 'agenda-supervision',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/agenda-supervision/agenda-supervision.component'
      ),
  },
  {
    path: 'minutas-resumen',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/minutas-resumen/minutas-resumen.component'
      ),
  },
  {
    path: 'reporte-tickets',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/reporte-tickets/reporte-tickets.component'
      ),
  },
  {
    path: 'grafico-resultado-general',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/resultado-general-grafico/resultado-general-grafico.component'
      ),
  },
  {
    path: 'resultado-general-posicion',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/resultado-general-posicion/resultado-general-posicion.component'
      ),
  },
  {
    path: 'evaluacion-areas',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas.component'
      ),
  },
  {
    path: 'resultado-general-dashboard',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/resultado-general-dashboard/resultado-general-dashboard.component'
      ),
  },
  {
    path: 'presentaciones-juntas-comite',
    loadComponent: () =>
      import(
        'src/app/pages/3-supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.component'
      ),
  },
] as Routes;
