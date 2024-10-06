import { Routes } from '@angular/router';
export default [
  {
    path: 'roles',
    loadComponent: () =>
      import('src/app/pages/configuracion/roles/list-roles.component'),
  },

  {
    path: 'categorias',
    loadComponent: () =>
      import('src/app/pages/configuracion/category/list-category.component'),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('src/app/pages/configuracion/customer/list-customer.component'),
  },
  {
    path: 'unidad-medida',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/unidad-medida/list-unidad-medida.component'
      ),
  },
  {
    path: 'depuracion',
    loadComponent: () =>
      import('src/app/pages/configuracion/depuracion/depuracion.component'),
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('src/app/pages/configuracion/panel-configuracion/panel.component'),
  },
  {
    path: 'historial-acceso',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/historial-acceso/access-log.component'
      ),
  },
  {
    path: 'categoria-medidor',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/medidores-categoria/list-medidor-categoria.component'
      ),
  },
  {
    path: 'clasificacion-equipo',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/clasificacion-equipo/list-clasificacion-equipo.component'
      ),
  },
  {
    path: 'supervisores-proveedores',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/provider-support/provider-support.component'
      ),
  },
  {
    path: 'catalogo-amenidades',
    title: 'catalogo-amenidades',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/amenities-catalog/list-amenities-catalog/list-amenities-catalog.component'
      ),
  },
  {
    path: 'catalog-inspection',
    title: 'catalog-inspection',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/catalog-inspection/list-catalog-inspection/list-catalog-inspection.component'
      ),
  },
  {
    path: 'residential-location',
    title: 'residential-location',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/residential-location/list-residential-location/list-residential-location.component'
      ),
  },
  {
    path: 'customer-amenities-catalog',
    title: 'customer-amenities-catalog',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/customer-amenities-catalog/list-customer-amenities-catalog/list-customer-amenities-catalog.component'
      ),
  },
  {
    path: 'list-recorrido',
    title: 'Recorridos',
    loadComponent: () =>
      import(
        'src/app/pages/configuracion/list-recorrido/list-recorrido.component'
      ),
  },

  {
    path: 'customer-data-company',
    title: 'CustomerDataCompany',
    loadComponent: () =>
      import(
        'src/app/pages/customer-data-company/list-customer-data-company.component'
      ),
  },
  {
    path: 'company-departaments',
    loadComponent: () =>
      import(
        'src/app/pages/company-departments/company-departments-list/company-departments-list.component'
      ),
  },
] as Routes;
