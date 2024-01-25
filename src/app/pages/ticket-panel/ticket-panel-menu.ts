export interface TicketPanelMenu {
  routerLink: string;
  title: string;
  icon: string;
}

export const ticketPanelMenuItems: TicketPanelMenu[] = [
  // {
  //   routerLink: '/ticket-panel/tickets',
  //   title: 'Limpieza',
  //   icon: 'fa-duotone fa-broom-wide',
  // },
  {
    routerLink: '/legal/list-ticket',
    title: 'Legal',
    icon: 'fa-duotone fa-gavel',
  },
];
