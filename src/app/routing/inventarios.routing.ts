import { Routes } from '@angular/router';

export default [
  {
    path: 'inventory-engine-system',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventory-engine-system/inventory-engine-system.component'
      ),
  },
  {
    path: 'equipos/:categoria',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/machineries/list-equipos.component'
      ),
  },
  {
    path: 'gimnasio',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/machineries/list-equipos.component'
      ),
  },
  {
    path: 'herramienta',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-inventarios/herramientas/list-herramientas.component'
      ),
  },
  {
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-pintura/inventario-pintura.component'
      ),
  },
  {
    path: 'llaves',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-llaves/list-llaves.component'
      ),
  },
  {
    path: 'reporte-equipos',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/machineries/reporte-completo-activos/reporte-completo-activos.component'
      ),
  },

  {
    path: 'reporte-herramientas',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-inventarios/herramientas/informe-herramienta-pdf.component'
      ),
  },
  {
    path: 'radios',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/radio-comunicacion/radio-comunicacion.component'
      ),
  },
  {
    path: 'cedula-anual-mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
  },
] as Routes;
