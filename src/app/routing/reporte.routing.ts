import { Routes } from '@angular/router';

export default [
  {
    path: 'mantenimiento-preventivo',
    loadComponent: () =>
      import('src/app/pages/service-order/ordenes-servicio.component'),
  },
  {
    path: 'mantenimiento-preventivo-reporte',
    loadComponent: () =>
      import('src/app/pages/service-order/reporte-ordenes-servicio.component'),
  },
  {
    path: 'resumen-ordenes-servicio',
    loadComponent: () =>
      import(
        'src/app/pages/service-order/resumen-ordenes-servicio/resumen-ordenes-servicio.component'
      ),
  },
  {
    path: 'soporte-orden-servicio/:id',
    loadComponent: () =>
      import('src/app/pages/service-order/soporte-orden-servicio.component'),
  },
] as Routes;
