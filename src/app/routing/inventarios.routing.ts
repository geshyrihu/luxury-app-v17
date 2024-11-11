import { Routes } from '@angular/router';

export default [
  {
    path: 'inventory-engine-system',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventory-engine-system/inventory-engine-system.component'
      ),
    data: {
      title: 'Sistema de Inventario',
    },
  },
  {
    path: 'equipos/:categoria',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/machineries/list-equipos.component'
      ),
    data: {
      title: 'Equipos por Categoría',
    },
  },
  {
    path: 'gimnasio',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/machineries/list-equipos.component'
      ),
    data: {
      title: 'Equipos de Gimnasio',
    },
  },
  {
    path: 'herramienta',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-inventarios/herramientas/list-herramientas.component'
      ),
    data: {
      title: 'Herramientas',
    },
  },
  {
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-pintura/inventario-pintura.component'
      ),
    data: {
      title: 'Inventario de Pintura',
    },
  },
  {
    path: 'llaves',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-llaves/list-llaves.component'
      ),
    data: {
      title: 'Inventario de Llaves',
    },
  },
  {
    path: 'reporte-equipos',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/machineries/reporte-completo-activos/reporte-completo-activos.component'
      ),
    data: {
      title: 'Reporte de Equipos',
    },
  },
  {
    path: 'reporte-herramientas',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-inventarios/herramientas/informe-herramienta-pdf.component'
      ),
    data: {
      title: 'Reporte de Herramientas',
    },
  },
  {
    path: 'radios',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/radio-comunicacion/radio-comunicacion.component'
      ),
    data: {
      title: 'Radio Comunicación',
    },
  },
  {
    path: 'cedula-anual-mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
    data: {
      title: 'Cédula Anual de Mantenimientos',
    },
  },
] as Routes;
