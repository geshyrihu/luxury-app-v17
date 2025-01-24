import { Routes } from '@angular/router';

export default [
  {
    path: 'ordenes-mantenimiento',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/service-order/ordenes-servicio.component'
      ),
    data: { title: 'ordenes-mantenimiento' },
  },
  {
    path: 'inspections-areas',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/inspections-areas/inspections-areas.component'
      ),
    title: 'Inspections-areas',
    data: { title: 'Inspections-areas' },
  },
  {
    path: 'recorrido',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/mantenimiento-recorrido/list-recorrido.component'
      ),
    title: 'Recorrido',
    data: { title: 'Recorrido' },
  },
  {
    path: 'equipos',
    loadComponent: () =>
      import('src/app/pages/bitacoras/javi-bitacora/javi-bitacora.component'),
    title: 'Equipos Recorrido',
    data: { title: 'Equipos Reocrrido' },
  },
  {
    path: 'piscina',
    loadComponent: () =>
      import('src/app/pages/bitacoras/piscina/list-piscina.component'),
    title: 'Bitacora Alberca',
    data: { title: 'Bitacora Alberca' },
  },
  {
    path: 'piscina-bitacora/:piscinaId',
    loadComponent: () =>
      import('src/app/pages/bitacoras/piscina/list-piscina-bitacora.component'),
    title: 'Bitacora de Piscina', // Añadido título
    data: { title: 'Bitacora de Piscina' },
  },
  {
    path: 'reporte-bitacora-recorrido',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/mantenimiento-recorrido/reporte-bitacora-recorrido.component'
      ),
    title: 'Reporte Bitacora Recorrido',
    data: { title: 'Reporte Bitacora Recorrido' },
  },
  {
    path: 'lista-medidor',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/medidores/list/lista-medidores.component'
      ),
    title: 'Lista de Medidores',
    data: { title: 'Lista de Medidores' },
  },
  {
    path: 'lista-medidar-lectura/:id',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/medidores/lecturas/list-medidor-lectura.component'
      ),
    title: 'Lectura de Medidor', // Añadido título
    data: { title: 'Lectura de Medidor' },
  },
  {
    path: 'grafico/:id',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/medidores/lecturas/chart-lectura.component'
      ),
    title: 'Gráfico de Lectura', // Añadido título
    data: { title: 'Gráfico de Lectura' },
  },

  {
    path: 'elevator-spare-parts-change',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/elevador-refacciones/list-elevator-spare-parts-change.component'
      ),
    title: 'Cambio de Refacción',
    data: { title: 'Cambio de Refacción' },
  },
  {
    path: 'elevators-emergency-call',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/elevador-llamados/list-elevators-emergency-call.component'
      ),
    title: 'Reporte de Emergencia',
    data: { title: 'Reporte de Emergencia' },
  },
  {
    path: 'my-inspection/:customerInspectionId',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/bitacora/my-inspection-ejecutar/my-inspection-ejecutar.component'
      ),
    title: 'Reporte de Emergencia',
    data: { title: 'Reporte de Emergencia' },
  },
] as Routes;
