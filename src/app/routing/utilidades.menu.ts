import { AuthService } from 'src/app/core/services/auth.service';

export const utilidadesMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
      'JefeMantenimiento',
    ]),
    label: '8.1 Utilidades',
    icon: 'fa-duotone fa-solid fa-screwdriver-wrench',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
          'JefeMantenimiento',
        ]),
        label: '8.1.1 Calculadora IVA',
        routerLink: '/utilidades/calcular-iva',
        name: 'utilidades-Calculadora',
      },
    ],
  },
];
