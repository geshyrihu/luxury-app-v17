import { AuthService } from 'src/app/core/services/auth.service';

export const inspectionMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'JefeMantenimiento',
    ]),
    label: 'Inspecciones',
    icon: 'fa-solid fa-tasks',
    name: 'Inspecciones',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
        ]),
        label: 'Administrar inspecciones',
        routerLink: '/inspections/catalog',
        name: 'Administrar inspecciones',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
          'Seguridad',
          'Limpieza',
          'Jardineria',
        ]),
        label: 'Ejecutar inspecciones',
        routerLink: '/inspections/my-inspection-list',
        name: 'Ejecutar inspecciones',
      },
    ],
  },
];
