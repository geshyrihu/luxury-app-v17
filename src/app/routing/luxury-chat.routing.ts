import { Routes } from '@angular/router';

export default [
  {
    path: 'list',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/groups/ticket-group-list/ticket-group-list.component'
      ),
  },
  {
    path: 'messages/:ticketGroupId',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/messages/ticket-message-list/ticket-message-list.component'
      ),
  },
  {
    path: 'message/:ticketMessageId',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/messages/ticket-message-view/ticket-message-view.component'
      ),
  },
  {
    path: 'my-tickets',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/my-tickets/my-tickets-list/my-tickets-list.component'
      ),
  },
  {
    path: 'my-requests',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/my-tickets/my-requests-ticket-message/my-requests-ticket-message.component'
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/reports/ticket-message-report/ticket-message-report.component'
      ),
  },
  {
    path: 'resumen',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/reports/ticket-message-report-resumen/ticket-message-report-resumen.component'
      ),
  },
  {
    path: 'work-plan',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/reports/ticket-message-report-work-plan/ticket-message-report-work-plan.component'
      ),
  },
  {
    path: 'weekly-report',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/reports/ticket-message-weekly-report/ticket-message-weekly-report.component'
      ),
  },
  {
    path: 'weekly-report-preview',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/reports/ticket-message-weekly-report-preview/ticket-message-weekly-report-preview.component'
      ),
  },
  {
    path: 'ticket-group-category',
    loadComponent: () =>
      import(
        'src/app/pages/5.0-tickets-v3/ticket-group-category/ticket-group-category-list/ticket-group-category-list.component'
      ),
  },
] as Routes;
