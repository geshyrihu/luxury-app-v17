import { Routes } from '@angular/router';

export default [
  {
    path: 'bitacora-diaria',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/bitacora-diaria/bitacora-diaria.component'
      ),
  },
  {
    path: 'minutas-resumen',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/minutas-resumen/minutas-resumen.component'
      ),
  },
  {
    path: 'reporte-tickets',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/reporte-tickets/reporte-tickets.component'
      ),
  },
  {
    path: 'grafico-resultado-general',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/resultado-general-grafico/resultado-general-grafico.component'
      ),
  },
  {
    path: 'resultado-general-posicion',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/resultado-general-posicion/resultado-general-posicion.component'
      ),
  },
  {
    path: 'evaluacion-areas',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/resultado-general-evaluacion-areas/resultado-general-evaluacion-areas.component'
      ),
  },
  {
    path: 'resultado-general-dashboard',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/resultado-general-dashboard/resultado-general-dashboard.component'
      ),
  },
  {
    path: 'presentaciones-juntas-comite',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/supervision/presentaciones-juntas-comite/presentaciones-juntas-comite.component'
      ),
  },
] as Routes;
