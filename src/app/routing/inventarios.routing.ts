import { Routes } from '@angular/router';

export default [
  {
    path: 'inventory-engine-system',
    loadComponent: () =>
      import(
        'src/app/pages/inventories/inventory-engine-system/inventory-engine-system.component'
      ),
  },
  {
    path: 'equipos/:categoria',
    loadComponent: () =>
      import('src/app/pages/machineries/list-equipos.component'),
  },
  {
    path: 'gimnasio',
    loadComponent: () =>
      import('src/app/pages/machineries/list-equipos.component'),
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
      import('src/app/pages/inventario-pintura/inventario-pintura.component'),
  },
  {
    path: 'llaves',
    loadComponent: () =>
      import('src/app/pages/inventario-llaves/list-llaves.component'),
  },
  {
    path: 'reporte-equipos',
    loadComponent: () =>
      import(
        'src/app/pages/machineries/reporte-completo-activos/reporte-completo-activos.component'
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
      import('src/app/pages/radio-comunicacion/radio-comunicacion.component'),
  },
  {
    path: 'cedula-anual-mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
  },
] as Routes;
