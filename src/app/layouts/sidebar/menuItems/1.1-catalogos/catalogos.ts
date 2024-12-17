import { AuthService } from 'src/app/core/services/auth.service';

export const catalogMenu = (authS: AuthService) => [
  {
    visible: authS.onValidateRoles(['SuperUsuario']),
    label: '1.1 Catalogos',
    icon: 'fa-duotone fa-solid fa-album-collection',
    name: 'catalog',
    items: [
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.1 Modulos App',
        routerLink: '/catalog/module-app',
        name: 'module-app',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.2 Roles',
        routerLink: '/catalog/roles',
        name: 'Roles',
      },

      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.3 Bancos',
        routerLink: '/catalog/banks',
        name: 'bancos',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.4 Forma de pago',
        routerLink: '/catalog/forma-pago',
        name: 'forma de pago',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.5 Metodo de pago',
        routerLink: '/catalog/metodo-pago',
        name: 'metodo de pago',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.6 Uso de cfdi',
        routerLink: '/catalog/uso-cfdi',
        name: 'uso de cfdi',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.7 Catalogo de cuentas',
        routerLink: '/contabilidad/catalogo-cuentas',
        name: 'Cuentas',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.8 Departamentos de trabajo',
        routerLink: '/catalog/company-departaments',
        name: 'company-departaments',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.9 Profesiones',
        routerLink: '/catalog/jobs',
        name: 'jobs',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.10 Categorias ticket',
        routerLink: '/catalog/ticket-group-category',
        name: 'ticket group category',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.11 Categoria Medidor',
        routerLink: '/catalog/meter-category',
        name: 'meter category',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.12 Categoria productos',
        routerLink: '/catalog/product-category',
        name: 'product category',
      },

      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.13 Clasificacion equipos',
        routerLink: '/catalog/machinery-classification',
        name: 'machinery-classification',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.14 Unidades de medida',
        routerLink: '/catalog/units-of-measurement',
        name: 'units-of-measurement',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.15 Entrega Recepción',
        routerLink: '/catalog/entrega-recepcion-cliente',
        name: 'entrega recepcion',
      },

      // {
      //   visible: authS.onValidateRoles([
      //     'GerenteMantenimiento',
      //     'JefeMantenimiento',
      //     'Administrador',
      //     'SuperUsuario',
      //   ]),
      //   label: 'Nomenclatura',
      //   routerLink: '/documento/nomenclatura',
      //   name: 'Capacitación-Nomenclatura',
      // },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.14 Calendario maestro mtto',
        routerLink: '/calendario/calendario-maestro-equipo',
        name: 'Capacitación-Guia calendario general de mtto',
      },
      {
        visible: authS.onValidateRoles(['SuperUsuario']),
        label: '1.1.15 Catalogo de colores',
        routerLink: '/catalog/catalog-color',
        name: 'Catalogo de colores',
      },
    ],
  },
];
