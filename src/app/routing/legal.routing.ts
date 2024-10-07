import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
  },
  {
    path: 'list-ticket-legal',
    loadComponent: () =>
      import(
        'src/app/pages/ticket-legal/legal-list-ticket/legal-list-ticket.component'
      ),
  },
  {
    path: 'list-ticket-customer',
    loadComponent: () =>
      import(
        'src/app/pages/ticket-legal/legal-list-ticket-customer/legal-list-ticket-customer.component'
      ),
  },
  {
    path: 'ticket/:ticketId',
    loadComponent: () =>
      import(
        'src/app/pages/ticket-legal/ticket-individual/ticket-individual.component'
      ),
  },
  {
    path: 'pendings',
    loadComponent: () =>
      import(
        'src/app/pages/ticket-legal/legal-reports-pending/legal-reports-pending.component'
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import(
        'src/app/pages/ticket-legal/legal-reports/legal-reports.component'
      ),
  },
] as Routes;
