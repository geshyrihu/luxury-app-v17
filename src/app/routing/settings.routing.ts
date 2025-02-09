import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
export default [
  {
    path: 'home',
    title: 'Configuración de sistema',
    loadComponent: () =>
      import('src/app/pages/settings/settings-home/settings-home.component'),
    canActivate: [AuthGuard],
    data: { title: 'Configuración de sistema' },
  },
  {
    path: 'application-user',
    title: 'Cuentas de Usuario',
    loadComponent: () =>
      import(
        'src/app/pages/settings/application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Administrador de usuarios' },
  },
  {
    path: 'module-app-rol',
    title: 'Administración Roles-Modulos',
    loadComponent: () =>
      import(
        'src/app/pages/settings/permisos/module-app-rol/module-app-rol.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Administración Roles-Modulos' },
  },
  {
    path: 'roles',
    title: 'RolesApp',
    loadComponent: () =>
      import('src/app/pages/settings/permisos/roles/roles-list.component'),
    canActivate: [AuthGuard],
    data: { title: 'RolesApp' },
  },
  {
    title: 'Actualizar modulos a Role',
    data: { title: 'Actualizar modulos a Role' },
    path: 'module-app-rol-update/:roleId/:roleName',
    loadComponent: () =>
      import(
        'src/app/pages/settings/permisos/module-app-rol/module-app-rol-update.component'
      ),
  },
  {
    path: 'depuration',
    loadComponent: () =>
      import(
        'src/app/pages/settings/mail-empresa/depuracion/depuracion.component'
      ),
    data: { title: 'Depuración' },
  },

  {
    path: 'supplier-supervisors',
    loadComponent: () =>
      import(
        'src/app/pages/settings/provider-support/provider-support.component'
      ),
    data: { title: 'Supervisores de Proveedores' },
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import(
        'src/app/pages/settings/permisos/customer/list-customer.component'
      ),
    data: { title: 'Clientes' },
  },
  {
    path: 'customer-data-company',
    title: 'CustomerDataCompany',
    loadComponent: () =>
      import(
        'src/app/pages/settings/mail-empresa/customer-data-company/list-customer-data-company.component'
      ),
    data: { title: 'Datos del Cliente por Empresa' },
  },

  {
    path: 'datos-email',
    loadComponent: () =>
      import(
        'src/app/pages/settings/mail-empresa/email-data/list-email-data.component'
      ),
    title: 'Datos de Correo',
    data: { title: 'Datos de Correo' },
  },
  {
    path: 'application-user',
    title: 'Cuentas de Usuario',
    loadComponent: () =>
      import(
        'src/app/pages/settings/application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Application User' },
  },

  {
    title: 'CustomerModul',
    data: { title: 'Modulos Clientes' },
    path: 'customer-modul',
    loadComponent: () =>
      import(
        'src/app/pages/settings/customer-modul-list/customer-modul-list.component'
      ),
  },
  {
    title: 'CustomerModulEdit',
    data: { title: 'Editar modulos' },
    path: 'customer-modul-edit/:customerId/:customerName',
    loadComponent: () =>
      import(
        'src/app/pages/settings/customer-modul-edit/customer-modul-edit.component'
      ),
  },
  {
    title: 'Module App',
    data: { title: 'Lista de Módulos' },
    path: 'module-app',
    loadComponent: () =>
      import(
        'src/app/pages/settings/permisos/module-app-list/module-app-list.component'
      ),
  },

  {
    path: 'inventario-productos',
    title: 'Inventario Insumos',
    data: { title: 'Inventario Insumos' }, // Cambiado a objeto
    loadComponent: () =>
      import(
        'src/app/pages/inventarios/inventario-productos/list-almacen-productos.component'
      ),
  },
  {
    path: 'application-user',
    title: 'Cuentas de Usuario',
    loadComponent: () =>
      import(
        'src/app/pages/settings/application-user/list-application-user.component'
      ),
    canActivate: [AuthGuard],
    data: { title: 'Application User' },
  },

  {
    title: 'Roles',
    data: { title: 'Lista de Roles' },
    path: 'roles',
    loadComponent: () =>
      import(
        'src/app/pages/settings/permisos/roles/roles-add-or-edit.component'
      ),
  },
  {
    title: 'Entrega y Recepción del Cliente',
    data: { title: 'Entrega y Recepción' },
    path: 'entrega-recepcion-cliente',
    loadComponent: () =>
      import(
        'src/app/pages/documentos/entrega-recepcion/list-catalogo-descripcion/list-catalogo-descripcion.component'
      ),
  },
  {
    title: 'Banks',
    data: { title: 'Lista de Bancos' },
    path: 'banks',
    loadComponent: () =>
      import('src/app/pages/settings/catalogos/bancos/banco-list.component'),
  },
  {
    title: 'Forma de Pago',
    data: { title: 'Lista de Formas de Pago' },
    path: 'forma-pago',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/forma-pago/list-forma-pago.component'
      ),
  },
  {
    title: 'Método de Pago',
    data: { title: 'Lista de Métodos de Pago' },
    path: 'metodo-pago',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/metodo-pago/list-metodo-pago.component'
      ),
  },
  {
    title: 'Uso CFDI',
    data: { title: 'Lista de Usos CFDI' },
    path: 'uso-cfdi',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/uso-cfdi/list-uso-cfdi.component'
      ),
  },
  {
    title: 'Jobs',
    data: { title: 'Lista de Profesiones' },
    path: 'jobs',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/professions/list-professions.component'
      ),
  },
  {
    title: 'Meter Category',
    data: { title: 'Lista de Categorías de Medidores' },
    path: 'meter-category',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/medidor-categoria/list-medidor-categoria.component'
      ),
  },
  {
    title: 'Product Category',
    data: { title: 'Lista de Categorías de Productos' },
    path: 'product-category',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/product-category/list-category.component'
      ),
  },

  {
    title: 'Machinery Classification',
    data: { title: 'Clasificación de Maquinaria' },
    path: 'machinery-classification',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/clasificacion-equipo/list-clasificacion-equipo.component'
      ),
  },
  {
    title: 'Company Departments',
    data: { title: 'Lista de Departamentos' },
    path: 'company-departaments',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/company-departments/company-departments-list.component'
      ),
  },
  {
    title: 'Units of Measurement',
    data: { title: 'Lista de Unidades de Medida' },
    path: 'units-of-measurement',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/unidad-medida/list-unidad-medida.component'
      ),
  },
  {
    title: 'Ticket Group Category',
    data: { title: 'Categoría de Grupos de Tickets' },
    path: 'ticket-group-category',
    loadComponent: () =>
      import(
        'src/app/pages/settings/catalogos/ticket-group-category/ticket-group-category-list.component'
      ),
  },

  //Mantenimiento
  {
    title: 'Fire Extinguishers',
    data: { title: 'Extintores' },
    path: 'extintores',
    loadComponent: () =>
      import(
        'src/app/pages/inventarios/inventario-extintor/inventario-extintor.component'
      ),
  },
  {
    title: 'Fire Extinguishers Group',
    data: { title: 'Grupo de Extintores' },
    path: 'extintores-group',
    loadComponent: () =>
      import(
        'src/app/pages/inventarios/inventario-extintor/inventario-extintor-group.component'
      ),
  },

  {
    title: 'catalog-asset',
    data: { title: 'catalog-asset' },
    path: 'catalog-asset',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/catalog/catalog-asset-list/catalog-asset-list.component'
      ),
  },
  {
    title: 'inspection-reviews-catalog',
    data: { title: 'inspection-reviews-catalog' },
    path: 'inspection-reviews-catalog',
    loadComponent: () =>
      import(
        'src/app/pages/bitacoras/inspection/catalog/inspection-reviews-catalog/inspection-reviews-catalog.component'
      ),
  },
] as Routes;
