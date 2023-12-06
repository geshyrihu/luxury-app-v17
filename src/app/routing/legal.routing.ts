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
    path: 'list-ticket',
    loadComponent: () =>
      import(
        'src/app/pages/legal/legal-list-ticket/legal-list-ticket.component'
      ),
  },
] as Routes;
