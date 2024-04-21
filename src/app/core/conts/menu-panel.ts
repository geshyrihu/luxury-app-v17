import { IMenuPanel } from '../interfaces/menu-panel-model';

export let menuPanel: IMenuPanel[] = [
  {
    group: 'Accesos',
    items: [
      {
        title: 'Cuentas',
        path: '/accounts/cuentas-usuario',
        icon: ' fa-user',
      },
      {
        title: 'Roles',
        path: '/configuracion/roles',
        icon: ' fa-key',
      },
      {
        title: 'Datos Email',
        path: '/accounts/datos-email',
        icon: 'fa-envelope',
      },
    ],
  },
  {
    group: 'Entrega Recepción',
    items: [
      {
        title: 'Descripción',
        path: '/entrega-recepcion/descripcion',
        icon: 'fa-people-arrows',
      },
    ],
  },
  {
    group: 'Compras',
    items: [
      {
        title: 'Uso de cfdi',
        path: '/contabilidad/uso-cfdi',
      },
      {
        title: 'Forma de pago',
        path: '/contabilidad/forma-pago',
      },
      {
        title: 'Metodo de pago',
        path: '/contabilidad/metodo-pago',
      },
      {
        title: 'Bancos',
        path: '/contabilidad/bancos',
      },
      {
        title: 'Catalogo de cuentas',
        path: '/contabilidad/catalogo-cuentas',
      },
    ],
  },
  {
    group: 'Mantenimiento',

    items: [
      {
        title: 'Supervisores de proveedores',
        path: '/configuracion/supervisores-proveedores',
      },
      {
        title: 'Clasificación Equipos',
        path: '/configuracion/clasificacion-equipo',
      },
      {
        title: 'Categorias',
        path: '/configuracion/categorias',
      },
      {
        title: 'Categoria Medidor',
        path: '/configuracion/categoria-medidor',
      },
      {
        title: 'Unidades de M.',
        path: '/configuracion/unidad-medida',
      },
      {
        title: 'Depuración',
        path: '/configuracion/depuracion',
      },
    ],
  },
  {
    group: 'Recorridos',

    items: [
      {
        title: 'Catalogo Amenidades',
        path: '/configuracion/catalogo-amenidades',
      },
      {
        title: 'Catalog Inspection',
        path: '/configuracion/catalog-inspection',
      },
      {
        title: 'Residencial Localizaciones',
        path: '/configuracion/residential-location',
      },
      {
        title: 'Clientes Amenities Catalogo',
        path: '/configuracion/customer-amenities-catalog',
      },
      {
        title: 'Recorridos',
        path: '/configuracion/list-recorrido',
      },
    ],
  },
  {
    group: 'General',

    items: [
      {
        title: 'Áreas Responsable',
        path: '/configuracion/areas-responsables',
      },
      {
        title: 'Profesiones',
        path: '/reclutamiento/profesiones',
      },
      {
        title: 'Clientes',
        path: '/configuracion/clientes',
      },
      {
        title: 'Historial de Acceso',
        path: '/configuracion/historial-acceso',
      },
    ],
  },
];
