import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/contabilidad-pendientes-minuta/cont-list-minuta-pendientes.component'
      ),
    data: { title: 'Pendientes de Minutas' },
  },
  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
    data: { title: 'Pendientes de Minutas Legal' },
  },
  {
    path: 'pendientes-minutas-pdf',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/cont-minuta-pendientes-pdf/cont-minuta-pendientes-pdf.component'
      ),
    data: { title: 'PDF Pendientes de Minutas' },
  },
  {
    path: 'catalogo-cuentas',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.7-calagogo-de-cuentas/list-cuentas-tercer-nivel.component'
      ),
    data: { title: 'Catálogo de Cuentas' },
  },
  {
    path: 'reporte-envio-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/reporte-envio-financieros/reporte-envio-financieros.component'
      ),
    data: { title: 'Reporte de Envío Financieros' },
  },
  {
    path: 'estados-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/estados-financieros/estado-financiero-list.component'
      ),
    data: { title: 'Estados Financieros' },
  },
] as Routes;
