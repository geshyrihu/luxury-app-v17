import { AuthService } from 'src/app/core/services/auth.service';

export const applicationUserMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['Sistemas', 'SuperUsuario']),
    label: '1.3 Usuarios',
    icon: 'fa-duotone fa-solid fa-user-tie',
    routerLink: '/accounts',
  },
];
