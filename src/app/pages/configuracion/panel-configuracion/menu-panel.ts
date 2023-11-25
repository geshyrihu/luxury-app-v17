import { IMenuPanel } from './menu-panel-model';

export let menuPanel: IMenuPanel[] = [
  {
    group: 'Accesos',
    items: [
      {
        title: 'Cuentas',
        path: '/accounts/cuentas-usuario',
      },
      {
        title: 'Nivel Acceso',
        path: '/configuracion/roles',
      },
      {
        title: 'Datos Email',
        path: '/accounts/datos-email',
      },
    ],
  },
  {
    group: 'Entrega Recepción',
    items: [
      {
        title: 'Descripción',
        path: '/entrega-recepcion/descripcion',
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
