import { Routes } from '@angular/router';

export default [
  {
    path: 'vacantes',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/vacantes/list-vacantes.component'
      ),
    data: { title: 'Vacantes' },
  },
  {
    path: 'altas',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/solicitud-alta/list-solicitud-alta.component'
      ),
    data: { title: 'Altas' },
  },
  {
    path: 'bajas',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/solicitud-baja/list-solicitud-baja.component'
      ),
    data: { title: 'Bajas' },
  },
  {
    path: 'aumento-sueldo',
    loadComponent: () =>
      import(
        'src/app/pages/reclutamiento/list-solicitudes/modificación-sueldo/list-solicitud-modificacion-salario.component'
      ),
    data: { title: 'Aumento de Sueldo' },
  },
] as Routes;
