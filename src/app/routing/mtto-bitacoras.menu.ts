import { AuthService } from 'src/app/core/services/auth.service';

export const mttoBitacorasMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles([
      'SuperUsuario',
      'SupervisionOperativa',
      'Administrador',
      'JefeMantenimiento',
      'AuxiliarMantenimiento',
    ]),
    label: 'Bitacoras de Mantenimiento',
    icon: 'fa-duotone fa-solid fa-book',
    name: 'Bitacoras de Mantenimiento',
    items: [
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
        ]),
        label: 'Ordenes de mantenimiento',
        routerLink: '/logbook/ordenes-mantenimiento',
        name: 'ordenes-mantenimiento',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
        ]),
        label: 'Recorrido equipos',
        routerLink: '/logbook/equipos',
        name: 'Equipos recorrido diario',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: 'Catalogo Inspecciones',
        routerLink: '/inspections/catalog',
        name: 'Equipos recorrido diario',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: 'Inspecciones ',
        routerLink: '/inspections/my-inspection-list',
        name: 'Inspecciones-areas',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
        ]),
        label: '5.7.2 Recorrido diario',
        routerLink: '/logbook/recorrido',
        name: 'Bitacoras-mantenimiento recorrido diario',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
        ]),
        label: '5.7.3 Lectura consumos',
        routerLink: '/logbook/lista-medidor',
        name: 'Bitacoras-medidores gas, agua y luz',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
        ]),
        label: '5.7.4 Mtto albercas',
        routerLink: '/logbook/piscina',
        name: 'Bitacoras-alberca',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
        ]),
        label: '5.7.5 Fallas Elevadores',
        routerLink: '/logbook/elevators-emergency-call',
        name: 'Reporte de elevadores',
      },
      {
        visible: authS.onValidateRoles([
          'SuperUsuario',
          'SupervisionOperativa',
          'Administrador',
          'JefeMantenimiento',
          'AuxiliarMantenimiento',
        ]),
        label: '5.7.6 Refacciones Elevadores',
        routerLink: '/logbook/elevator-spare-parts-change',
        name: 'Cambio de refacciones elevadores',
      },
    ],
  },
];
