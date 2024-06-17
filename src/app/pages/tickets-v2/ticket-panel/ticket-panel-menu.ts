import { ITicketPanelMenu } from 'src/app/core/interfaces/ticket-panel.menu.interface';

export const MenuTikecket: ITicketPanelMenu[] = [
  // {
  //   routerLink: '/tickets/supervition',
  //   title: 'Supervision',
  //   icon: 'fa-duotone fa-user-tie',
  // },
  // {
  //   routerLink: '/tickets/administration',
  //   title: 'Administracion',
  //   icon: 'fa-duotone fa-screwdriver-wrench',
  // },
  // {
  //   routerLink: '/tickets/sistem',
  //   title: 'Sistemas',
  //   icon: 'fa-duotone fa-laptop-mobile',
  // },
  // {
  //   routerLink: '/tickets/jardineria',
  //   title: 'Jardineria',
  //   icon: 'fa-duotone fa-house-tree',
  // },
  // {
  //   routerLink: '/tickets/limpieza',
  //   title: 'Limpieza',
  //   icon: 'fa-duotone fa-broom-wide',
  // },
  // {
  //   routerLink: '/tickets/seguridad',
  //   title: 'Seguridad',
  //   icon: 'fa-sharp fa-solid fa-building-lock',
  // },

  // {
  //   routerLink: '/tickets/constuctora',
  //   title: 'Constuctora',
  //   icon: 'fa-duotone fa-user-helmet-safety',
  // },

  // correcto
  {
    routerLink: '/operaciones/reporte/tiket-mantenimiento',
    title: 'Mantenimiento',
    icon: 'fa-duotone fa-screwdriver-wrench',
  },
  {
    routerLink: '/legal/list-ticket-customer',
    title: 'Legal',
    icon: 'fa-duotone fa-gavel',
  },
];
