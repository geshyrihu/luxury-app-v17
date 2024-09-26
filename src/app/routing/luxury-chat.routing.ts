import { Routes } from '@angular/router';

export default [
  {
    path: 'list',
    loadComponent: () =>
      import(
        'src/app/pages/tickets-v3/luxury-chat-group-list/luxury-chat-group-list.component'
      ),
  },
  {
    path: 'messages/:luxuryChatGroupId',
    loadComponent: () =>
      import(
        'src/app/pages/tickets-v3/luxury-chat-message-list/luxury-chat-message-list.component'
      ),
  },
] as Routes;
