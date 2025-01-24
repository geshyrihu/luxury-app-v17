import { Routes } from '@angular/router';

export default [
  {
    path: 'general',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion-cliente/entrega-recepcion-cliente.component'
      ),
    data: {
      title: 'Entrega Recepción - General',
    },
  },
  {
    path: 'equipos',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/equipos/equipos.component'
      ),
    data: {
      title: 'Entrega Recepción - Equipos',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'instalaciones',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/instalaciones/instalaciones.component'
      ),
    data: {
      title: 'Entrega Recepción - Instalaciones',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'herramientas',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/herramientas/herramientas.component'
      ),
    data: {
      title: 'Entrega Recepción - Herramientas',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'insumos',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/insumos/insumos.component'
      ),
    data: {
      title: 'Entrega Recepción - Insumos',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'mantenimientos',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/mantenimientos/mantenimientos.component'
      ),
    data: {
      title: 'Entrega Recepción - Mantenimientos',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'organigrama',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/organigrama/organigrama.component'
      ),
    data: {
      title: 'Entrega Recepción - Organigrama',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'llaves',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/llaves/llaves.component'
      ),
    data: {
      title: 'Entrega Recepción - Llaves',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'hidrantes',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/hidrantes/hidrantes.component'
      ),
    data: {
      title: 'Entrega Recepción - Hidrantes',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
  {
    path: 'mantenimientos-pendientes',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/mantenimientos-pendientes/mantenimientos-pendientes.component'
      ),
    data: {
      title: 'Entrega Recepción - Mantenimientos Pendientes',
      // Puedes agregar más datos aquí si lo necesitas
    },
  },
] as Routes;
