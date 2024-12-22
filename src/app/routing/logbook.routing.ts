import { Routes } from '@angular/router';

export default [
  // {
  //   path: 'bitacora-equipos',
  //   loadComponent: () =>
  //     import(
  //       'src/app/pages/5.3-bitacoras/bitacora-mantenimiento/bitacora-mantenimiento.component'
  //     ),
  //   title: 'Bitacora de Equipos',
  //   data: { title: 'Bitacora de Equipos' },
  // },
  {
    path: 'inspections',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/inspections/inspections-list.component'
      ),
    title: 'Inspections',
    data: { title: 'Inspections' },
  },
  {
    path: 'inspections-areas',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/inspections/inspections-areas/inspections-areas.component'
      ),
    title: 'Inspections-areas',
    data: { title: 'Inspections-areas' },
  },
  {
    path: 'recorrido',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-recorrido/list-recorrido.component'
      ),
    title: 'Recorrido',
    data: { title: 'Recorrido' },
  },
  {
    path: 'equipos',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-bitacoras/javi-bitacora/javi-bitacora.component'
      ),
    title: 'Equipos Recorrido',
    data: { title: 'Equipos Reocrrido' },
  },
  {
    path: 'piscina',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/piscina/list-piscina/list-piscina.component'
      ),
    title: 'Bitacora Alberca',
    data: { title: 'Bitacora Alberca' },
  },
  {
    path: 'piscina-bitacora/:piscinaId',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/piscina/list-piscina-bitacora/list-piscina-bitacora.component'
      ),
    title: 'Bitacora de Piscina', // Añadido título
    data: { title: 'Bitacora de Piscina' },
  },
  {
    path: 'reporte-bitacora-recorrido',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-recorrido/reporte-bitacora-recorrido.component'
      ),
    title: 'Reporte Bitacora Recorrido',
    data: { title: 'Reporte Bitacora Recorrido' },
  },
  {
    path: 'lista-medidor',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/medidores/medidores/lista-medidores/lista-medidores.component'
      ),
    title: 'Lista de Medidores',
    data: { title: 'Lista de Medidores' },
  },
  {
    path: 'lista-medidar-lectura/:id',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/medidores/medidores-lectura/list-medidor-lectura/list-medidor-lectura.component'
      ),
    title: 'Lectura de Medidor', // Añadido título
    data: { title: 'Lectura de Medidor' },
  },
  {
    path: 'grafico/:id',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/medidores/medidores-lectura/chart-lectura/chart-lectura.component'
      ),
    title: 'Gráfico de Lectura', // Añadido título
    data: { title: 'Gráfico de Lectura' },
  },

  {
    path: 'elevator-spare-parts-change',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/elevator/list-elevator-spare-parts-change/list-elevator-spare-parts-change.component'
      ),
    title: 'Cambio de Refacción',
    data: { title: 'Cambio de Refacción' },
  },
  {
    path: 'elevators-emergency-call',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-bitacoras/elevator/list-elevators-emergency-call/list-elevators-emergency-call.component'
      ),
    title: 'Reporte de Emergencia',
    data: { title: 'Reporte de Emergencia' },
  },
] as Routes;
