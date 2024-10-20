import { Routes } from '@angular/router';

export default [
  {
    path: 'panel',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/maintenance-reports.component'
      ),
  },
  {
    path: 'resumen-mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/resumen-mantenimientos/resumen-mantenimientos.component'
      ),
  },

  {
    path: 'consumos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-consumos/report-consumos.component'
      ),
  },

  {
    path: 'entrada-almacen',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-entrada-almacen/report-entrada-almacen.component'
      ),
  },
  {
    path: 'salida-almacen',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-salida-almacen/report-salida-almacen.component'
      ),
  },
  {
    path: 'recorrido-diario',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-recorrido-diario/report-recorrido-diario.component'
      ),
  },
  {
    path: 'prestamo-herramienta',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-prestamo-herramienta/report-prestamo-herramienta.component'
      ),
  },
  {
    path: 'solicitud-compra',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-solicitud-compra/report-solicitud-compra.component'
      ),
  },
  {
    path: 'alberca',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-bitacora-alberca/report-bitacora-alberca.component'
      ),
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento-reportes/report-ticket/report-ticket.component'
      ),
  },
  {
    path: 'elevadores',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/elevator/list-elevators-emergency-call/list-elevators-emergency-call.component'
      ),
  },
] as Routes;
