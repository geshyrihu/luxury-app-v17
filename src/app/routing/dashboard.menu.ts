import { AuthService } from 'src/app/core/services/auth.service';

export const dashboardMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.1 DASHBOARD'),
    label: '5.1 Dashboard',
    icon: 'fa-duotone fa-solid fa-grid-horizontal',
    routerLink: '/dashboard',
    name: 'Dashboard',
  },
];
