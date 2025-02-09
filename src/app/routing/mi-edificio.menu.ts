import { AuthService } from 'src/app/core/services/auth.service';

export const miEdificioMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'JefeMantenimiento',
      'Asistente',
    ]),
    label: '5.2 Mi Edificio',
    icon: 'fa-duotone fa-solid fa-house-building',
    routerLink: '/operaciones/mi-edificio',
    name: 'Mi edificio',
  },
];
