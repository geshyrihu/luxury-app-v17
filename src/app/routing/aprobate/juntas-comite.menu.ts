import { AuthService } from 'src/app/core/services/auth.service';

export const juntasDeComiteMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'Asistente',
    ]),
    label: 'Juntas con comite',
    icon: 'fa-duotone fa-solid fa-person-chalkboard',
    name: 'Juntas con comite',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
        ]),
        label: 'Presentacion JC',
        routerLink: '/junta-comite/presentaciones',
        name: 'Presentaciones juntas de comité',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'Asistente',
        ]),
        label: 'Minutas JC',
        routerLink: '/junta-comite/minutas',
        name: 'Minutas',
      },
    ],
  },
];
