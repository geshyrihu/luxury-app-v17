import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
    data: {
      title: 'Pendientes de Minutas Legal',
    },
  },
  {
    path: 'list-ticket-legal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-list-ticket/legal-list-ticket.component'
      ),
    data: {
      title: 'Listado de Tickets Legales',
    },
  },
  {
    path: 'list-ticket-customer',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-list-ticket-customer/legal-list-ticket-customer.component'
      ),
    data: {
      title: 'Listado de Tickets del Cliente',
    },
  },
  {
    path: 'ticket/:ticketId',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/ticket-individual/ticket-individual.component'
      ),
    data: {
      title: 'Detalles del Ticket',
    },
  },
  {
    path: 'pendings',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-reports-pending/legal-reports-pending.component'
      ),
    data: {
      title: 'Reportes Pendientes Legales',
    },
  },
  {
    path: 'reports-internal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-reports/legal-reports-internal.component'
      ),
    data: {
      title: 'Reportes Internos Legales',
    },
  },
  {
    path: 'reports-external',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-reports/legal-reports-external.component'
      ),
    data: {
      title: 'Reportes Externos Legales',
    },
  },
  {
    path: 'legal-matter',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/legal-matter-list/legal-matter-list.component'
      ),
    data: {
      title: 'Listado de Asuntos Legales',
    },
  },
] as Routes;
