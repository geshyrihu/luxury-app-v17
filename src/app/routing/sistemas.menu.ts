import { AuthService } from 'src/app/core/services/auth.service';

export const sistemasMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['Sistemas']),
    label: '4.1 Sistemas',
    icon: 'fa-duotone fa-solid fa-laptop-code',
    items: [
      {
        visible: authS.onValidateRoles(['Sistemas']),
        label: '4.1.1 Tickets',
        routerLink: '/sistemas/ticket-sistemas',
        name: 'Sistemas-Tickets',
      },
    ],
  },
];
