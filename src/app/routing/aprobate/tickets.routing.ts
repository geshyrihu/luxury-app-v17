import { Routes } from '@angular/router';

export default [
  {
    path: 'groups-list',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/groups/ticket-group-list/ticket-group-list.component'
      ),
    data: { title: 'Grupos de trabajo' },
  },

  {
    path: 'my-assignments',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/my-tickets/my-assigned-tickets-list/my-assigned-tickets-list.component'
      ),
    data: { title: 'Mis tickets' },
  },
  {
    path: 'my-requests',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/my-tickets/my-requests-ticket-message/my-requests-ticket-message.component'
      ),
    data: { title: 'Mis solicitudes' },
  },

  {
    path: 'messages/:ticketGroupId',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/messages/ticket-message-list/ticket-message-list.component'
      ),
    data: { title: 'Tickets' },
  },
  {
    path: 'message/:ticketMessageId/:ticketGroupId/:notificationUserId',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/messages/ticket-message-view/ticket-message-view.component'
      ),
    data: { title: 'Detalle' },
  },

  {
    path: 'reports',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/messages/ticket-message-report/ticket-message-report.component'
      ),
    data: { title: 'Reportes' },
  },
  {
    path: 'resumen',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/reports/ticket-message-report-resumen/ticket-message-report-resumen.component'
      ),
    data: { title: 'Resumen' },
  },
  {
    path: 'work-plan',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/reports/ticket-message-report-work-plan/ticket-message-report-work-plan.component'
      ),
    data: { title: 'Plan de trabajo' },
  },
  {
    path: 'work-plan-preview',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/reports/ticket-message-report-work-plan-preview/ticket-message-report-work-plan-preview.component'
      ),
    data: { title: 'Vista previa plan de trabajo' },
  },
  {
    path: 'weekly-report',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/reports/ticket-message-operation-report/ticket-message-operation-report.component'
      ),
    data: { title: 'Reporte semanal' },
  },
  {
    path: 'weekly-report-preview',
    loadComponent: () =>
      import(
        'src/app/pages/tickets/reports/ticket-message-weekly-report-preview/ticket-message-weekly-report-preview.component'
      ),
    data: { title: 'Reporte semanal vista previa' },
  },
] as Routes;
