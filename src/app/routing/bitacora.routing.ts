import { Routes } from '@angular/router';

export default [
  // { path: 'bitacora-equipos', component: BitacoraMantenimientoComponent },
  {
    path: 'bitacora-equipos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/recorridos/bitacora-mantenimiento.component'
      ),
    title: 'Bitacora de equipos',
  },

  {
    path: 'recorrido',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-recorrido/list-recorrido.component'
      ),
    title: 'Recorrido',
  },

  {
    path: 'piscina',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/piscina/list-piscina/list-piscina.component'
      ),
    title: 'Bitacora Alberca',
  },
  {
    path: 'piscina-bitacora/:piscinaId',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/piscina/list-piscina-bitacora/list-piscina-bitacora.component'
      ),
  },
  {
    path: 'reporte-bitacora-recorrido',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-recorrido/reporte-bitacora-recorrido.component'
      ),
    title: 'Reporte Bitacora Recorrido',
  },
  {
    path: 'lista-medidor',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/medidores/medidores/lista-medidores/lista-medidores.component'
      ),
    title: 'Lista de medidores',
  },
  {
    path: 'lista-medidar-lectura/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/medidores/medidores-lectura/list-medidor-lectura/list-medidor-lectura.component'
      ),
  },
  {
    path: 'grafico/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/medidores/medidores-lectura/chart-lectura/chart-lectura.component'
      ),
  },
  {
    path: 'prestamo-herramienta',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-bitacoras/prestamo-herramienta/control-prestamo-herramientas.component'
      ),
    title: 'Prestamo de herramientas',
  },
] as Routes;
