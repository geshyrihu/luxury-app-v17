import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
  },
  {
    path: 'list-ticket-legal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-list-ticket/legal-list-ticket.component'
      ),
  },
  {
    path: 'list-ticket-customer',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-list-ticket-customer/legal-list-ticket-customer.component'
      ),
  },
  {
    path: 'ticket/:ticketId',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/ticket-individual/ticket-individual.component'
      ),
  },
  {
    path: 'pendings',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-reports-pending/legal-reports-pending.component'
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/ticket-legal/legal-reports/legal-reports.component'
      ),
  },
  {
    path: 'legal-matter',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/legal-matter-list/legal-matter-list.component'
      ),
  },
] as Routes;
