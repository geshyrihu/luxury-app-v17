import { Routes } from '@angular/router';

export default [
  {
    path: 'vacantes',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/list-solicitud-vacantes/list-vacantes.component'
      ),
  },
  {
    path: 'altas',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/list-solicitud-alta/list-solicitud-alta.component'
      ),
  },
  {
    path: 'bajas',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/list-solicitud-baja/list-solicitud-baja.component'
      ),
  },
  {
    path: 'aumento-sueldo',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/list-solicitud-modificación-sueldo/list-solicitud-modificacion-salario.component'
      ),
  },
] as Routes;
