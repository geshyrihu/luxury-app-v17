import { AuthService } from 'src/app/core/services/auth.service';

export const miEdificioMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.2 MIEDIFICIO'),
    label: '5.2 Mi Edificio',
    icon: 'fa-duotone fa-solid fa-house-building',
    routerLink: '/operaciones/mi-edificio',
    name: 'Mi edificio',
  },
];
