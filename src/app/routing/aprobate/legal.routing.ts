import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

export default [
  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import('src/app/pages/legal/legal-pendientes-minuta.component'),
    data: {
      title: 'Pendientes de Minutas Legal',
    },
  },
  {
    path: 'list-ticket-legal',
    loadComponent: () =>
      import('src/app/pages/legal/ticket-legal/legal-list-ticket.component'),
    data: {
      title: 'Listado de Tickets',
    },
  },
  {
    path: 'pendings',
    loadComponent: () =>
      import(
        'src/app/pages/legal/ticket-legal/legal-reports-pending.component'
      ),
    data: {
      title: 'Reporte general de pendientes',
    },
  },

  {
    path: 'reports-internal',
    loadComponent: () =>
      import(
        'src/app/pages/legal/ticket-legal/legal-reports-internal.component'
      ),
    data: {
      title: 'Reporte interno',
    },
  },

  {
    path: 'reports-external',
    loadComponent: () =>
      import(
        'src/app/pages/legal/ticket-legal/legal-reports-external.component'
      ),
    data: {
      title: 'Reporte externo',
    },
  },

  {
    path: 'directorio-comites',
    loadComponent: () =>
      import(
        'src/app/pages/directorios/comite-vigilancia/comites-list.component'
      ),
    canActivate: [AuthGuard], // Se agregó canActivate aquí
    data: { title: 'Directorio de comites' },
  },

  {
    path: 'legal-matter',
    loadComponent: () =>
      import('src/app/pages/legal/legal-matter/legal-matter-list.component'),
    data: {
      title: 'Catalogo de Asuntos Legales',
    },
  },
  //Esta ruta se agregó en la versión 1.0.0 para que accedieran los adminsitradores
  {
    path: 'list-ticket-customer',
    loadComponent: () =>
      import(
        'src/app/pages/legal/ticket-legal/legal-list-ticket-customer.component'
      ),
    data: {
      title: 'Listado de Tickets del Cliente',
    },
  },
  //Esta ruta se agregó en la versión 1.0.0 para que accedieran los adminsitradores

  {
    path: 'ticket/:ticketId',
    loadComponent: () =>
      import('src/app/pages/legal/ticket-legal/ticket-individual.component'),
    data: {
      title: 'Detalles del Ticket',
    },
  },
] as Routes;
