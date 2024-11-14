import { AuthService } from 'src/app/core/services/auth.service';

export const juntasDeComiteMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.4 JUNTASCOMITE'),
    label: '5.4 Juntas con comite',
    icon: 'fa-duotone fa-solid fa-person-chalkboard',
    name: 'Juntas con comite',
    items: [
      {
        visible: authS.canRead('5.4 JUNTASCOMITE'),
        label: '5.4.1 Presentacion JC',
        routerLink: '/operaciones/presentacion-junta-comite/presentaciones',
        name: 'Operaciones-Presentaciones juntas de comité',
      },
      {
        visible: authS.canRead('5.4 JUNTASCOMITE'),
        label: '5.4.2 Minutas JC',
        routerLink: '/operaciones/junta-comite/minutas',
        name: 'Operaciones-Minuta',
      },
    ],
  },
];
