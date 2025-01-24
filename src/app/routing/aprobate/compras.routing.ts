import { Routes } from '@angular/router';

export default [
  {
    path: 'cedula-cliente',
    title: 'Cédula Cliente',
    data: { title: 'Cédula Cliente' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/cedula-presupuestal/cedula-cliente-list.component'
      ),
  },
  {
    path: 'presupuesto-individual/:id',
    title: 'Presupuesto Individual',
    data: { title: 'Presupuesto Individual' },
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/presupuesto-edition/presupuesto-individual.component'
      ),
  },
  {
    path: 'presupuestos',
    title: 'Presupuestos',
    data: { title: 'Lista de Presupuestos' },
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/presupuesto-edition/list-presupuesto.component'
      ),
  },
  {
    path: 'solicitudes-compra',
    title: 'Solicitudes de Compra',
    data: { title: 'Solicitudes de Compra' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/solicitud-compra/list-solicitud-compra.component'
      ),
  },
  {
    path: 'solicitud-compra/:id',
    title: 'Solicitud de Compra',
    data: { title: 'Solicitud de Compra' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/solicitud-compra/solicitud-compra.component'
      ),
  },
  {
    path: 'pdf-solicitud-compra/:id',
    title: 'PDF Solicitud de Compra',
    data: { title: 'PDF Solicitud de Compra' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/pdf-solicitud-compra/pdf-solicitud-compra.component'
      ),
  },
  {
    path: 'cuadro-comparativo/:id',
    title: 'Cuadro Comparativo',
    data: { title: 'Cuadro Comparativo' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/cuadro-comparativo/cuadro-comparativo-list.component'
      ),
  },
  {
    path: 'ordenes-compra',
    title: 'Órdenes de Compra',
    data: { title: 'Órdenes de Compra' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/orden-compra/list-orden-compra.component'
      ),
  },

  {
    path: 'orden-compra/:id',
    title: 'Orden de Compra',
    data: { title: 'Orden de Compra' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/orden-compra/orden-compra.component'
      ),
  },
  {
    path: 'orden-compra-pdf/:id',
    title: 'PDF Orden de Compra',
    data: { title: 'PDF Orden de Compra' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/orden-compra-pdf/orden-compra-pdf.component'
      ),
  },
  {
    path: 'solicitud-pago-pdf/:id',
    title: 'PDF Solicitud de Pago',
    data: { title: 'PDF Solicitud de Pago' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/onden-compra-pdf-solicitud-pago/onden-compra-pdf-solicitud-pago.component'
      ),
  },
  {
    path: 'ordenes-compra-fijos',
    title: 'Órdenes de Compra Fijos',
    data: { title: 'Órdenes de Compra Fijos' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/orden-compra-catalogo-gastos-fijos/list-orden-compra-fijos/list-orden-compra-fijos.component'
      ),
  },
  {
    path: 'catalogo-gastos-fijos',
    title: 'Catálogo de Gastos Fijos',
    data: { title: 'Catálogo de Gastos Fijos' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/orden-compra-catalogo-gastos-fijos/catalogo-gastos-fijos/catalogo-gastos-fijos.component'
      ),
  },
  {
    path: 'pagadas',
    title: 'Órdenes de Compra Pagadas',
    data: { title: 'Órdenes de Compra Pagadas' },
    loadComponent: () =>
      import(
        'src/app/pages/compras/orden-compra/orden-compra-pagadas/orden-compra-pagadas.component'
      ),
  },
  {
    path: 'mtto-presupuesto',
    title: 'Mantenimiento de Presupuesto',
    data: { title: 'Mantenimiento de Presupuesto' },
    loadComponent: () =>
      import(
        'src/app/pages/reportes/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
  },
  {
    title: 'Products and Services',
    data: { title: 'Lista de Productos y Servicios' },
    path: 'products-services',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/productos/productos-list.component'
      ),
  },
] as Routes;
