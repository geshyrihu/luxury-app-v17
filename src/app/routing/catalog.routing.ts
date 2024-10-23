import { Routes } from '@angular/router';

export default [
  {
    path: 'module-app',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/module-app/module-app-list/module-app-list.component'
      ),
  },
  {
    path: 'entrega-recepcion-cliente',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/list-catalogo-descripcion/list-catalogo-descripcion.component'
      ),
  },
  {
    path: 'banks',
    loadComponent: () =>
      import('src/app/pages/catalog/bancos/list-banco.component'),
  },
  {
    path: 'forma-pago',
    loadComponent: () =>
      import('src/app/pages/catalog/forma-pago/list-forma-pago.component'),
  },
  {
    path: 'metodo-pago',
    loadComponent: () =>
      import('src/app/pages/catalog/metodo-pago/list-metodo-pago.component'),
  },
  {
    path: 'uso-cfdi',
    loadComponent: () =>
      import('src/app/pages/catalog/uso-cfdi/list-uso-cfdi.component'),
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('src/app/pages/catalog/professions/list-professions.component'),
  },
  {
    path: 'meter-category',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/medidor-categoria/list-medidor-categoria.component'
      ),
  },
  {
    path: 'product-category',
    loadComponent: () =>
      import('src/app/pages/catalog/product-category/list-category.component'),
  },
  {
    path: 'products-services',
    loadComponent: () =>
      import('src/app/pages/catalog/productos/list-productos.component'),
  },
  {
    path: 'machinery-classification',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/clasificacion-equipo/list-clasificacion-equipo.component'
      ),
  },
  {
    path: 'company-departaments',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/company-departments/company-departments-list/company-departments-list.component'
      ),
  },
  {
    path: 'units-of-measurement',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/unidad-medida/list-unidad-medida.component'
      ),
  },
  {
    path: 'ticket-group-category',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/ticket-group-category/ticket-group-category-list/ticket-group-category-list.component'
      ),
  },
] as Routes;
