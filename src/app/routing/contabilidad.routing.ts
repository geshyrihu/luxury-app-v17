import { Routes } from '@angular/router';

export default [
  {
    path: 'pendientes-minutas',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/contabilidad-pendientes-minuta/cont-list-minuta-pendientes.component'
      ),
  },

  {
    path: 'pendientes-minutas-legal',
    loadComponent: () =>
      import(
        'src/app/pages/legal/pendientes-minuta/legal-pendientes-minuta.component'
      ),
  },
  {
    path: 'pendientes-minutas-pdf',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/cont-minuta-pendientes-pdf/cont-minuta-pendientes-pdf.component'
      ),
  },
  {
    path: 'bancos',
    loadComponent: () =>
      import('src/app/pages/configuracion/bancos/list-banco.component'),
  },

  {
    path: 'catalogo-cuentas',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/cuentas-tercer-nivel/list-cuentas-tercer-nivel.component'
      ),
  },
  {
    path: 'forma-pago',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/forma-pago/list-forma-pago.component'
      ),
  },
  {
    path: 'metodo-pago',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/metodo-pago/list-metodo-pago.component'
      ),
  },
  {
    path: 'uso-cfdi',
    loadComponent: () =>
      import('src/app/pages/configuracion/uso-cfdi/list-uso-cfdi.component'),
  },

  {
    path: 'reporte-envio-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/reporte-envio-financieros/reporte-envio-financieros.component'
      ),
  },
  {
    path: 'estados-financieros',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/estados-financieros/estado-financiero-list.component'
      ),
  },
] as Routes;
