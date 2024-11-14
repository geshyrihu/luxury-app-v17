import { Routes } from '@angular/router';

export default [
  {
    path: 'documento',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/documentos/documento/list-documento.component'
      ),
    data: { title: 'Documentos' },
  },
  {
    path: 'poliza',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/documentos/contrato-poliza/list-contrato-poliza.component'
      ),
    data: { title: 'Póliza' },
  },
  {
    path: 'contracts-policies-view-legal',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/contracts-policies/contracts-policies.component'
      ),
    data: { title: 'Póliza' },
  },
  {
    path: 'formatos',
    loadComponent: () =>
      import('src/app/pages/5.5-capacitacion/formato/formato.component'),
    title: 'Formatos', // Añadido título
    data: { title: 'Formatos' },
  },
  {
    path: 'procesos',
    loadComponent: () =>
      import('src/app/pages/5.5-capacitacion/proceso/proceso.component'),
    title: 'Procesos', // Añadido título
    data: { title: 'Procesos' },
  },
  {
    path: 'comunicado',
    loadComponent: () =>
      import('src/app/pages/5.5-capacitacion/comunicado/comunicado.component'),
    title: 'Comunicado', // Añadido título
    data: { title: 'Comunicado' },
  },
] as Routes;
