import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/contabilidad-pendientes-minuta/cont-list-minuta-pendientes.component'
      ),
  },

  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/1-legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
  },
  {
    path: 'pendientes-minutas-pdf',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/cont-minuta-pendientes-pdf/cont-minuta-pendientes-pdf.component'
      ),
  },

  {
    path: 'catalogo-cuentas',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/cuentas-tercer-nivel/list-cuentas-tercer-nivel.component'
      ),
  },
  {
    path: 'reporte-envio-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/reporte-envio-financieros/reporte-envio-financieros.component'
      ),
  },
  {
    path: 'estados-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/estados-financieros/estado-financiero-list.component'
      ),
  },
] as Routes;
