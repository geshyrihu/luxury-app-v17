import { Routes } from '@angular/router';

export default [
  {
    path: 'mantenimiento-preventivo',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-ordenes-servicio/ordenes-servicio.component'
      ),
  },
  {
    path: 'mantenimiento-preventivo-reporte',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-ordenes-servicio/reporte-ordenes-servicio.component'
      ),
  },
  {
    path: 'resumen-ordenes-servicio',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-ordenes-servicio/resumen-ordenes-servicio/resumen-ordenes-servicio.component'
      ),
  },
  {
    path: 'soporte-orden-servicio/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-ordenes-servicio/soporte-orden-servicio.component'
      ),
  },
] as Routes;
