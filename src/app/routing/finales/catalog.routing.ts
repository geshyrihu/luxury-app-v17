import { Routes } from '@angular/router';

export default [
  {
    title: 'Module App',
    data: { title: 'Lista de Módulos' },
    path: 'module-app',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/module-app/module-app-list/module-app-list.component'
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
      import('src/app/pages/catalog/bancos/list-banco.component'),
  },
  {
    title: 'Forma de Pago',
    data: { title: 'Lista de Formas de Pago' },
    path: 'forma-pago',
    loadComponent: () =>
      import('src/app/pages/catalog/forma-pago/list-forma-pago.component'),
  },
  {
    title: 'Método de Pago',
    data: { title: 'Lista de Métodos de Pago' },
    path: 'metodo-pago',
    loadComponent: () =>
      import('src/app/pages/catalog/metodo-pago/list-metodo-pago.component'),
  },
  {
    title: 'Uso CFDI',
    data: { title: 'Lista de Usos CFDI' },
    path: 'uso-cfdi',
    loadComponent: () =>
      import('src/app/pages/catalog/uso-cfdi/list-uso-cfdi.component'),
  },
  {
    title: 'Jobs',
    data: { title: 'Lista de Profesiones' },
    path: 'jobs',
    loadComponent: () =>
      import('src/app/pages/catalog/professions/list-professions.component'),
  },
  {
    title: 'Meter Category',
    data: { title: 'Lista de Categorías de Medidores' },
    path: 'meter-category',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/medidor-categoria/list-medidor-categoria.component'
      ),
  },
  {
    title: 'Product Category',
    data: { title: 'Lista de Categorías de Productos' },
    path: 'product-category',
    loadComponent: () =>
      import('src/app/pages/catalog/product-category/list-category.component'),
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
        'src/app/pages/catalog/clasificacion-equipo/list-clasificacion-equipo.component'
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
        'src/app/pages/catalog/unidad-medida/list-unidad-medida.component'
      ),
  },
  {
    title: 'Ticket Group Category',
    data: { title: 'Categoría de Grupos de Tickets' },
    path: 'ticket-group-category',
    loadComponent: () =>
      import(
        'src/app/pages/catalog/ticket-group-category/ticket-group-category-list/ticket-group-category-list.component'
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
] as Routes;
