import { Routes } from '@angular/router';

export default [
  {
    path: 'panel',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/maintenance-reports.component'
      ),
    data: { title: 'Mantenimiento de reportes' },
  },
  {
    path: 'resumen-mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/resumen-mantenimientos/resumen-mantenimientos.component'
      ),
    data: { title: 'Resumen de mantenimientos' },
  },
  {
    path: 'consumos',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-consumos/report-consumos.component'
      ),
    data: { title: 'Reportes de consumos' },
  },
  {
    path: 'entrada-almacen',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-entrada-almacen/report-entrada-almacen.component'
      ),
    data: { title: 'Reportes de entrada al almacén' },
  },
  {
    path: 'salida-almacen',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-salida-almacen/report-salida-almacen.component'
      ),
    data: { title: 'Reportes de salida del almacén' },
  },
  {
    path: 'recorrido-diario',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-recorrido-diario/report-recorrido-diario.component'
      ),
    data: { title: 'Recorrido diario' },
  },
  {
    path: 'prestamo-herramienta',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-prestamo-herramienta/report-prestamo-herramienta.component'
      ),
    data: { title: 'Préstamo de herramienta' },
  },
  {
    path: 'solicitud-compra',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-solicitud-compra/report-solicitud-compra.component'
      ),
    data: { title: 'Solicitud de compra' },
  },
  {
    path: 'alberca',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-bitacora-alberca/report-bitacora-alberca.component'
      ),
    data: { title: 'Bitácora de alberca' },
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-reportes/report-ticket/report-ticket.component'
      ),
    data: { title: 'Tickets' },
  },
  {
    path: 'elevadores',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/elevador-llamados/list-elevators-emergency-call.component'
      ),
    data: { title: 'Elevadores' },
  },

  {
    path: 'mantenimiento-preventivo-reporte',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/service-order/reporte-ordenes-servicio.component'
      ),
    data: { title: 'Reporte Mantenimiento Preventivo' },
  },
  {
    path: 'soporte-orden-servicio/:id',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/service-order/soporte-orden-servicio.component'
      ),
    data: { title: 'Soporte a Orden de Servicio' },
  },
] as Routes;
