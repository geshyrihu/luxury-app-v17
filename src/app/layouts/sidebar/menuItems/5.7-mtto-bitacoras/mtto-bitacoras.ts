import { AuthService } from 'src/app/core/services/auth.service';

export const mttoBitacorasMenu = (authS: AuthService) => [
  {
    visible: authS.canRead('5.7 MTTOBITACORAS'),
    label: '5.7 Mtto Bitacoras',
    icon: 'fa-duotone fa-solid fa-book',
    name: 'Mtto Bitacoras',
    items: [
      {
        visible: authS.canRead('5.7 MTTOBITACORAS'),
        label: '5.7.1 Recorrido equipos',
        routerLink: '/logbook/equipos',
        name: 'Equipos recorrido diario',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: 'Inspecciones',
        routerLink: '/logbook/inspections',
        name: 'Equipos recorrido diario',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: 'Inspecciones-areas',
        routerLink: '/logbook/inspections-areas',
        name: 'Inspecciones-areas',
      },
      {
        visible: authS.canRead('5.7 MTTOBITACORAS'),
        label: '5.7.2 Recorrido diario',
        routerLink: '/logbook/recorrido',
        name: 'Bitacoras-mantenimiento recorrido diario',
      },
      {
        visible: authS.canRead('5.7 MTTOBITACORAS'),
        label: '5.7.3 Lectura consumos',
        routerLink: '/logbook/lista-medidor',
        name: 'Bitacoras-medidores gas, agua y luz',
      },
      {
        visible: authS.canRead('5.7 MTTOBITACORAS'),
        label: '5.7.4 Mtto albercas',
        routerLink: '/logbook/piscina',
        name: 'Bitacoras-alberca',
      },
      {
        visible: authS.canRead('5.7 MTTOBITACORAS'),
        label: '5.7.5 Fallas Elevadores',
        routerLink: '/logbook/elevators-emergency-call',
        name: 'Reporte de elevadores',
      },
      {
        visible: authS.canRead('5.7 MTTOBITACORAS'),
        label: '5.7.6 Refacciones Elevadores',
        routerLink: '/logbook/elevator-spare-parts-change',
        name: 'Cambio de refacciones elevadores',
      },
    ],
  },
];
