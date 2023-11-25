import { Routes } from '@angular/router';

export default [
  {
    path: 'equipos/:categoria',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/activos/list-equipos.component'
      ),
  },
  {
    path: 'gimnasio',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/activos/list-equipos.component'
      ),
  },
  {
    path: 'herramienta',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/herramientas/list-herramientas.component'
      ),
  },
  {
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-catalogos/pintura/inventario-pintura.component'
      ),
  },
  {
    path: 'llaves',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/llaves/list-llaves.component'
      ),
  },
  {
    path: 'reporte-equipos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/activos/reporte-completo-activos/reporte-completo-activos.component'
      ),
  },
  {
    path: 'actas-entrega-equipos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-actas-entrega/actas-entrega-equipos.component'
      ),
  },
  {
    path: 'reporte-herramientas',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/herramientas/informe-herramienta-pdf.component'
      ),
  },
  {
    path: 'radios',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-inventarios/radio-comunicacion/radio-comunicacion.component'
      ),
  },
  {
    path: 'cedula-anual-mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
  },
] as Routes;
