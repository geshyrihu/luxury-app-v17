import { Routes } from '@angular/router';

export default [
  {
    path: 'documento',
    loadComponent: () =>
      import('src/app/pages/documentos/documento/list-documento.component'),
    data: { title: 'Documentos' },
  },
  {
    path: 'poliza',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/contrato-poliza/list-contrato-poliza.component'
      ),
    data: { title: 'Póliza' },
  },
  {
    path: 'contracts-policies-view-legal',
    loadComponent: () =>
      import(
        'src/app/pages/reportes/contracts-policies/contracts-policies.component'
      ),
    data: { title: 'Póliza' },
  },
  {
    path: 'formatos',
    loadComponent: () =>
      import('src/app/pages/capacitacion/formato/formato-list.component'),
    title: 'Formatos', // Añadido título
    data: { title: 'Formatos' },
  },
  {
    path: 'procesos',
    loadComponent: () =>
      import('src/app/pages/capacitacion/proceso/proceso-list.component'),
    title: 'Procesos', // Añadido título
    data: { title: 'Procesos' },
  },
  {
    path: 'comunicado',
    loadComponent: () =>
      import('src/app/pages/capacitacion/comunicado/comunicado-list.component'),
    title: 'Comunicado', // Añadido título
    data: { title: 'Comunicado' },
  },
  {
    title: 'Lighting',
    data: { title: 'Iluminación' },
    path: 'iluminacion',
    loadComponent: () =>
      import(
        'src/app/pages/inventarios/inventario-iluminacion/inventario-iluminacion.component'
      ),
  },
  {
    title: 'Paint',
    data: { title: 'Pintura' },
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/inventarios/inventario-pintura/inventario-pintura.component'
      ),
  },
] as Routes;
