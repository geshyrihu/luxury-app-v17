import { Routes } from '@angular/router';

export default [
  {
    path: 'cedula-cliente',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/cedula-presupuestal/cedula-cliente.component'
      ),
    data: { title: 'Cédula Cliente' },
  },
  {
    path: 'presupuesto-individual/:id',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/presupuesto-edition/presupuesto-individual.component'
      ),
    data: { title: 'Presupuesto Individual' },
  },
  {
    path: 'presupuestos',
    loadComponent: () =>
      import(
        'src/app/pages/2-contabilidad/presupuesto-edition/list-presupuesto/list-presupuesto.component'
      ),
    data: { title: 'Lista de Presupuestos' },
  },
  {
    path: 'solicitudes-compra',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/solicitud-compra/list-solicitud-compra.component'
      ),
    data: { title: 'Solicitudes de Compra' },
  },
  {
    path: 'solicitud-compra/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/solicitud-compra/solicitud-compra.component'
      ),
    data: { title: 'Solicitud de Compra' },
  },
  {
    path: 'pdf-solicitud-compra/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/pdf-solicitud-compra/pdf-solicitud-compra.component'
      ),
    data: { title: 'PDF Solicitud de Compra' },
  },
  {
    path: 'cuadro-comparativo/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/cuadro-comparativo/cuadro-comparativo.component'
      ),
    data: { title: 'Cuadro Comparativo' },
  },
  {
    path: 'ordenes-compra',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/orden-compra/list-orden-compra.component'
      ),
    data: { title: 'Órdenes de Compra' },
  },

  {
    path: 'orden-compra/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/orden-compra/orden-compra.component'
      ),
    data: { title: 'Orden de Compra' },
  },
  {
    path: 'orden-compra-pdf/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/orden-compra-pdf/orden-compra-pdf.component'
      ),
    data: { title: 'PDF Orden de Compra' },
  },
  {
    path: 'solicitud-pago-pdf/:id',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/onden-compra-pdf-solicitud-pago/onden-compra-pdf-solicitud-pago.component'
      ),
    data: { title: 'PDF Solicitud de Pago' },
  },
  {
    path: 'ordenes-compra-fijos',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/orden-compra-catalogo-gastos-fijos/list-orden-compra-fijos/list-orden-compra-fijos.component'
      ),
    data: { title: 'Órdenes de Compra Fijos' },
  },
  {
    path: 'catalogo-gastos-fijos',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/orden-compra-catalogo-gastos-fijos/catalogo-gastos-fijos/catalogo-gastos-fijos.component'
      ),
    data: { title: 'Catálogo de Gastos Fijos' },
  },
  {
    path: 'pagadas',
    loadComponent: () =>
      import(
        'src/app/pages/5.2-compras/compras/orden-compra/orden-compra/orden-compra-pagadas/orden-compra-pagadas.component'
      ),
    data: { title: 'Órdenes de Compra Pagadas' },
  },
  {
    path: 'mtto-presupuesto',
    loadComponent: () =>
      import(
        'src/app/pages/8.0-reportes/mantenimiento/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
    data: { title: 'Mantenimiento de Presupuesto' },
  },
] as Routes;
