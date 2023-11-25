import { Routes } from '@angular/router';

export default [
  {
    path: 'cedula-cliente',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/cedula-presupuestal/cedula-cliente.component'
      ),
  },
  {
    path: 'presupuesto-individual/:id',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/presupuesto-edition/presupuesto-individual.component'
      ),
  },
  {
    path: 'presupuestos',
    loadComponent: () =>
      import(
        'src/app/pages/contabilidad/presupuesto-edition/list-presupuesto/list-presupuesto.component'
      ),
  },
  {
    path: 'solicitudes-compra',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/solicitud-compra/list-solicitud-compra.component'
      ),
  },
  {
    path: 'solicitud-compra/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/solicitud-compra/solicitud-compra.component'
      ),
  },
  {
    path: 'pdf-solicitud-compra/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/pdf-solicitud-compra/pdf-solicitud-compra.component'
      ),
  },
  {
    path: 'cuadro-comparativo/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/cuadro-comparativo/cuadro-comparativo.component'
      ),
  },
  {
    path: 'ordenes-compra',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/orden-compra/list-orden-compra.component'
      ),
  },
  {
    path: 'caratula-fondeo',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/caratula-fondeo/vista-caratula-fondeo/vista-caratula-fondeo.component'
      ),
  },
  {
    path: 'orden-compra/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/orden-compra/orden-compra.component'
      ),
  },
  {
    path: 'orden-compra-pdf/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/orden-compra-pdf/orden-compra-pdf.component'
      ),
  },
  {
    path: 'solicitud-pago-pdf/:id',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/onden-compra-pdf-solicitud-pago/onden-compra-pdf-solicitud-pago.component'
      ),
  },
  {
    path: 'ordenes-compra-fijos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/orden-compra-catalogo-gastos-fijos/list-orden-compra-fijos/list-orden-compra-fijos.component'
      ),
  },
  {
    path: 'catalogo-gastos-fijos',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/orden-compra-catalogo-gastos-fijos/catalogo-gastos-fijos/catalogo-gastos-fijos.component'
      ),
  },
  {
    path: 'pagadas',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/compras/orden-compra/orden-compra/orden-compra-pagadas/orden-compra-pagadas.component'
      ),
  },
  {
    path: 'mtto-presupuesto',
    loadComponent: () =>
      import(
        'src/app/pages/operaciones/mantenimiento/mantenimiento-presupuesto/gastos-mantenimiento.component'
      ),
  },
] as Routes;
