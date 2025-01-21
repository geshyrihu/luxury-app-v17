import { Routes } from '@angular/router';

export default [
  {
    title: 'Roles',
    data: { title: 'Lista de Roles' },
    path: 'roles',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.2-roles/roles-add-or-edit.component'
      ),
  },
  {
    title: 'Entrega y Recepción del Cliente',
    data: { title: 'Entrega y Recepción' },
    path: 'entrega-recepcion-cliente',
    loadComponent: () =>
      import(
        'src/app/pages/6.3-documentos/entrega-recepcion/list-catalogo-descripcion/list-catalogo-descripcion.component'
      ),
  },
  {
    title: 'Banks',
    data: { title: 'Lista de Bancos' },
    path: 'banks',
    loadComponent: () =>
      import('src/app/pages/1.1-catalogos/1.1.3-bancos/list-banco.component'),
  },
  {
    title: 'Forma de Pago',
    data: { title: 'Lista de Formas de Pago' },
    path: 'forma-pago',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.4-forma-pago/list-forma-pago.component'
      ),
  },
  {
    title: 'Método de Pago',
    data: { title: 'Lista de Métodos de Pago' },
    path: 'metodo-pago',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.5-metodo-pago/list-metodo-pago.component'
      ),
  },
  {
    title: 'Uso CFDI',
    data: { title: 'Lista de Usos CFDI' },
    path: 'uso-cfdi',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.6-uso-cfdi/list-uso-cfdi.component'
      ),
  },
  {
    title: 'Jobs',
    data: { title: 'Lista de Profesiones' },
    path: 'jobs',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.9-professions/list-professions.component'
      ),
  },
  {
    title: 'Meter Category',
    data: { title: 'Lista de Categorías de Medidores' },
    path: 'meter-category',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.11-medidor-categoria/list-medidor-categoria.component'
      ),
  },
  {
    title: 'Product Category',
    data: { title: 'Lista de Categorías de Productos' },
    path: 'product-category',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.12-product-category/list-category.component'
      ),
  },
  {
    title: 'Products and Services',
    data: { title: 'Lista de Productos y Servicios' },
    path: 'products-services',
    loadComponent: () =>
      import('src/app/pages/catalog/productos/list-productos.component'),
  },
  {
    title: 'Machinery Classification',
    data: { title: 'Clasificación de Maquinaria' },
    path: 'machinery-classification',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.13-clasificacion-equipo/list-clasificacion-equipo.component'
      ),
  },
  {
    title: 'Company Departments',
    data: { title: 'Lista de Departamentos' },
    path: 'company-departaments',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/company-departments/company-departments-list/company-departments-list.component'
      ),
  },
  {
    title: 'Units of Measurement',
    data: { title: 'Lista de Unidades de Medida' },
    path: 'units-of-measurement',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.14-unidad-medida/list-unidad-medida.component'
      ),
  },
  {
    title: 'Ticket Group Category',
    data: { title: 'Categoría de Grupos de Tickets' },
    path: 'ticket-group-category',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.10-ticket-group-category/ticket-group-category-list/ticket-group-category-list.component'
      ),
  },

  // Validar si sirve,
  {
    path: 'nomenclatura',
    loadComponent: () =>
      import(
        'src/app/pages/5.5-capacitacion/nomenclatura/nomenclatura.component'
      ),
    title: 'Nomenclatura', // Añadido título
    data: { title: 'Nomenclatura' },
  },

  //Mantenimiento
  {
    title: 'Fire Extinguishers',
    data: { title: 'Extintores' },
    path: 'extintores',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-extintor/inventario-extintor.component'
      ),
  },
  {
    title: 'Fire Extinguishers Group',
    data: { title: 'Grupo de Extintores' },
    path: 'extintores-group',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-extintor/inventario-extintor-group.component'
      ),
  },
  {
    title: 'Lighting',
    data: { title: 'Iluminación' },
    path: 'iluminacion',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-iluminacion/inventario-iluminacion.component'
      ),
  },
  {
    title: 'Paint',
    data: { title: 'Pintura' },
    path: 'pintura',
    loadComponent: () =>
      import(
        'src/app/pages/5.4-inventarios/inventario-pintura/inventario-pintura.component'
      ),
  },
  {
    title: 'Catalog-color',
    data: { title: 'Catalog-color' },
    path: 'catalog-color',
    loadComponent: () =>
      import(
        'src/app/pages/1.1-catalogos/1.1.15-catalog-color/catalog-color.component'
      ),
  },
  {
    title: 'catalog-asset',
    data: { title: 'catalog-asset' },
    path: 'catalog-asset',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/catalog/catalog-asset-list/catalog-asset-list.component'
      ),
  },
  {
    title: 'inspection-reviews-catalog',
    data: { title: 'inspection-reviews-catalog' },
    path: 'inspection-reviews-catalog',
    loadComponent: () =>
      import(
        'src/app/pages/5.3-mantenimiento/inspection/catalog/inspection-reviews-catalog/inspection-reviews-catalog.component'
      ),
  },
] as Routes;
