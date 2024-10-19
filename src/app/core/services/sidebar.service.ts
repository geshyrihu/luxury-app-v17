import { Injectable, inject } from '@angular/core';
import { IMenuItem } from '../interfaces/menu.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private authS = inject(AuthService);

  get onLoadMenu() {
    return this.menu;
  }
  menu: IMenuItem[] = [
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: 'Catalgogos',
      icon: 'fa-thin fa-album-collection',
      name: 'catalog',
      items: [
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Administradoras',
          routerLink: '/catalog/administrators',
          name: 'module-app',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Bancos',
          routerLink: '/catalog/banks',
          name: 'bancos',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Entrega Recepción',
          routerLink: '/catalog/entrega-recepcion-cliente',
          name: 'entrega recepcion',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Forma de pago',
          routerLink: '/catalog/forma-pago',
          name: 'forma de pago',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Metodo de pago',
          routerLink: '/catalog/metodo-pago',
          name: 'metodo de pago',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Modulos',
          routerLink: '/catalog/module-app',
          name: 'module-app',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Uso de cfdi',
          routerLink: '/catalog/uso-cfdi',
          name: 'uso de cfdi',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Puestos de trabajo',
          routerLink: '/catalog/jobs',
          name: 'jobs',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Categoria Medidor',
          routerLink: '/catalog/meter-category',
          name: 'meter category',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Categoria productos',
          routerLink: '/catalog/product-category',
          name: 'product category',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Productos y servicios',
          routerLink: '/catalog/products-services',
          name: 'products-services',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Clasificacion equipos',
          routerLink: '/catalog/machinery-classification',
          name: 'machinery-classification',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Departamentos',
          routerLink: '/catalog/company-departaments',
          name: 'company-departaments',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Unidades de medida',
          routerLink: '/catalog/units-of-measurement',
          name: 'units-of-measurement',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: 'Configuración',
      icon: 'fa-thin fa-gear',
      name: 'Configuración',
      items: [
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Depuración',
          routerLink: '/settings/depuration',
          name: 'depuration',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Historial de acceso',
          routerLink: '/settings/access-history',
          name: 'access-history',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Supervisores de proveedores',
          routerLink: '/settings/supplier-supervisors',
          name: 'supplier-supervisors',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Emails corporativos',
          routerLink: '/settings/customer-data-company',
          name: 'customer-data-company',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Datos de email',
          routerLink: '/accounts/datos-email',
          name: 'datos de correos',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Configuración',
          routerLink: '/settings/panel',
          name: 'Configuración',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles(['Sistemas', 'SuperUsuario']),
      label: 'Usuarios',
      icon: 'fa-thin fa-user-tie',
      routerLink: '/application-user',
    },

    {
      visible: this.authS.canRead('MIEDIFICIO'),
      label: 'Mi Edificio',
      icon: 'fa-thin fa-building',
      routerLink: '/operaciones/mi-edificio',
      name: 'Mi edificio',
    },
    {
      visible: this.authS.canRead('LEGAL'),
      label: '1.-Legal',
      icon: 'fa-thin fa-gavel',
      items: [
        {
          visible: this.authS.canRead('LEGAL'),
          label: 'Minutas',
          routerLink: '/contabilidad/pendientes-minutas-legal',
          name: 'Legal-Minutas',
        },
        {
          visible: this.authS.canRead('LEGAL'),
          label: 'Legal Tickets',
          routerLink: '/legal/list-ticket-legal',
          name: 'Tickets',
        },
        {
          visible: this.authS.canRead('LEGAL'),
          label: 'Pendientes',
          routerLink: '/legal/pendings',
          name: 'pendientes legal',
        },
        {
          visible: this.authS.canRead('LEGAL'),
          label: 'Reportes',
          routerLink: '/legal/reports',
          name: 'reportes legal',
        },
        {
          visible: this.authS.canRead('LEGAL'),
          label: 'Categorias y asuntos',
          routerLink: '/legal/legal-matter',
          name: 'reportes legal',
        },
      ],
    },
    {
      visible: this.authS.canRead('CONTABILIDAD'),
      label: '2.-Contabilidad',
      icon: 'fa-thin fa-hand-holding-dollar',
      items: [
        {
          visible: this.authS.canRead('CONTABILIDAD'),
          label: 'Presentaciones',
          routerLink: '/operaciones/presentacion-junta-comite/presentaciones',
          name: 'Contabilidad-Presentaciones',
        },
        {
          visible: this.authS.canRead('CONTABILIDAD'),
          label: 'Minutas',
          routerLink: '/contabilidad/pendientes-minutas',
          name: 'Contabilidad-Pendientes-Minutas',
        },
        {
          visible: this.authS.canRead('CONTABILIDAD'),
          label: 'Estados Financieros',
          routerLink: '/contabilidad/estados-financieros',
          name: 'Estados financieros',
        },
        {
          visible: this.authS.canRead('CONTABILIDAD'),
          label: 'Presupuesto',
          routerLink: '/operaciones/compras/cedula-cliente',
          name: 'Contabilidad-Presupuesto',
        },
        {
          visible: this.authS.canRead('CONTABILIDAD'),
          label: 'Reporte Envio Financieros',
          routerLink: '/contabilidad/reporte-envio-financieros',
          name: 'Reporte-Envio-Financieros',
        },
        {
          visible: this.authS.canRead('CONTABILIDAD'),
          label: 'Catalogo de cuentas',
          routerLink: '/contabilidad/catalogo-cuentas',
          name: 'Cuentas',
        },
      ],
    },
    {
      visible: this.authS.canRead('SUPERVISION'),
      label: '3.-Op-Supervisión',
      icon: 'fa-thin fa-user-tie',
      items: [
        {
          visible: this.authS.canRead('SUPERVISION'),
          label: 'Bitácora Diaria',
          routerLink: '/supervision/agenda-supervision',
          name: 'Supervisión-Bitacora Diaria',
        },
        {
          visible: this.authS.canRead('SUPERVISION'),
          label: 'Resultado General',
          routerLink: '//supervision/resultado-general-dashboard',
          name: 'Supervisión-Resultado General',
        },
        {
          visible: this.authS.canRead('SUPERVISION'),
          label: 'Reporte Presentaciones',
          routerLink: '//supervision/presentaciones-juntas-comite',
          name: 'Supervisión-Reporte presentaciónes juntas de comité',
        },
        {
          visible: this.authS.canRead('SUPERVISION'),
          label: 'Reporte Minutas',
          routerLink: '/supervision/minutas-resumen',
          name: 'Supervisión-Reporte minutas',
        },
        {
          visible: this.authS.canRead('SUPERVISION'),
          label: 'Reporte Ticket',
          routerLink: '/supervision/reporte-tickets',
          name: 'Supervisión-Reporte tickets',
        },

        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'SuperUsuario',
          ]),
          label: 'Entrega Recepción',
          items: [
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'General',
              routerLink: '/entrega-recepcion/general',
              name: 'Supervisión-Entrega recepción',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Equipos',
              routerLink: '/operaciones/entrega-recepcion/equipos',
              name: 'Supervisión-Entrega recepción-Equipos',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Instalaciones',
              routerLink: '/operaciones/entrega-recepcion/instalaciones',
              name: 'Supervisión-Entrega recepción-Instalaciones',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Extintores',
              routerLink: '/operaciones/entrega-recepcion/hidrantes',
              name: 'Supervisión-Entrega recepción-Hidrantes',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Llaves',
              routerLink: '/operaciones/entrega-recepcion/llaves',
              name: 'Supervisión-Entrega recepción-Llaves',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Herramientas',
              routerLink: '/operaciones/entrega-recepcion/herramientas',
              name: 'Supervisión-Entrega recepción-Herramientas',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Mantenimientos',
              routerLink: '/operaciones/entrega-recepcion/mantenimientos',
              name: 'Supervisión-Entrega recepción-Mantenimientos',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Pendientes',
              routerLink:
                'operaciones/entrega-recepcion/mantenimientos-pendientes',
              name: 'Supervisión-Entrega recepción-Pendientes',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Organigrama',
              routerLink: '/operaciones/entrega-recepcion/organigrama',
              name: 'Supervisión-Entrega recepción-Organigrama',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Planos',
              routerLink: '/operaciones/entrega-recepcion/planos',
              name: 'Supervisión-Entrega recepción-Planos',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Insumos',
              routerLink: '/operaciones/entrega-recepcion/insumos',
              name: 'Supervisión-Entrega recepción-Insumos',
            },
          ],
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles(['Sistemas', 'SuperUsuario']),
      label: '4.-Sistemas',
      icon: 'fa-thin fa-laptop-code',
      items: [
        {
          visible: this.authS.onValidateRoles(['Sistemas', 'SuperUsuario']),
          label: 'Tickets',
          routerLink: '/sistemas/ticket-sistemas',
          name: 'Sistemas-Tickets',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles(['SuperUsuario', 'Reclutamiento']),
      label: '5.-Tickets V3',
      icon: 'fa-thin fa-ticket',
      name: 'Tickets',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Categorias',
          routerLink: '/luxury-chat/ticket-group-category',
          name: 'ticket group category',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Grupos',
          routerLink: '/luxury-chat/list',
          name: 'groups',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Asignados a mi',
          routerLink: '/luxury-chat/my-tickets',
          name: 'my assignments',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Mis solicitudes',
          routerLink: '/luxury-chat/my-requests',
          name: 'my request',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Reportes',
          routerLink: '/luxury-chat/reports',
          name: 'message report',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Residente',
        'Contador',
        'Asistente',
      ]),
      label: '5.-Tickets',
      icon: 'fa-thin fa-ticket',
      routerLink: '/tickets/panel',
      name: 'Tickets',
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'Colaborador',
        'Direccion',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '5.1-Operaciones',
      icon: 'fa-thin fa-person-chalkboard',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Direccion',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Resumen',
          routerLink: '/inicio/dashboard',
          name: 'Operaciones-Pendientes',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Presentacion JC',
          routerLink: '/operaciones/presentacion-junta-comite/presentaciones',
          name: 'Operaciones-Presentaciones juntas de comité',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Minutas',
          routerLink: '/operaciones/junta-comite/minutas',
          name: 'Operaciones-Minuta',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Mtto Preventivo',
          routerLink: '/reporte/mantenimiento-preventivo',
          name: 'Operaciones-Mantenimientos preventivos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),

          label: 'Tickets',
          routerLink: '/operaciones/reporte/tiket-mantenimiento',
          name: 'Operaciones-Tickets',
        },

        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),

          label: 'Reportes',
          routerLink: '/operaciones/reportes-mantenimiento/panel',
          name: 'Operaciones-Reporte general mensual de manteniento',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Mis Proveedores',
          routerLink: '/operaciones/mis-proveedores',
          name: 'Operaciones-Mis proveedores',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Mantenimiento',
        'Asistente',
        'Mantenimiento',
        'Residente',
      ]),
      label: '5.2-Compras',
      icon: 'fa-thin fa-bag-shopping',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
            'Contador',
          ]),

          label: 'Ultimo Presupuesto',
          routerLink: '/operaciones/compras/cedula-cliente',
          name: 'Compras-Cedula presupuestal',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
            'Contador',
          ]),

          label: 'Presupuestos',
          routerLink: '/operaciones/compras/presupuestos',
          name: 'Compras-Cedula presupuestal',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Residente',
          ]),

          label: 'Cuentas Mtto',
          routerLink: '/operaciones/compras/mtto-presupuesto',
          name: 'Compras-Cuentas Mtto',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
          ]),

          label: 'Productos y servicios',
          routerLink: '/catalog/products-services',
          name: 'Compras-Productos y servicios',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
          ]),
          label: 'Solicitud compra',
          routerLink: '/operaciones/compras/solicitudes-compra',
          name: 'Compras-Solicitudes de compra',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'Mantenimiento',
          ]),
          label: 'OC Fijos',
          routerLink: '/operaciones/compras/ordenes-compra-fijos',
          name: 'Compras-ordenes de compra gastos fijos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'Mantenimiento',
          ]),
          label: 'OC Variables',
          routerLink: '/operaciones/compras/ordenes-compra',
          name: 'Compras-ordenes de compra gastos variables',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Catalogo OC Fijos',
          routerLink: '/operaciones/compras/catalogo-gastos-fijos',
          name: 'Compras-catalogo ordenes de compra gastos fijos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'OC Pagadas',
          routerLink: '/operaciones/compras/pagadas',
          name: 'Compras-ordenes de compra pagadas',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Colaborador',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
      ]),
      label: '5.3-Bitacoras Mtto',
      icon: 'fa-thin fa-book',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
          ]),
          label: 'Recorrido diario',
          routerLink: '/mantenimiento/bitacora/recorrido',
          name: 'Bitacoras-mantenimiento recorrido diario',
        },
        {
          visible: this.authS.onValidateRoles([
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Consumos lecturas',
          routerLink: '/mantenimiento/bitacora/lista-medidor',
          name: 'Bitacoras-medidores gas, agua y luz',
        },
        {
          visible: this.authS.onValidateRoles([
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Albercas',
          routerLink: '/mantenimiento/bitacora/piscina',
          name: 'Bitacoras-alberca',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'Asistente',
            'SuperUsuario',
          ]),
          label: 'Llamados Emergencia Elevadores',
          routerLink: '/mantenimiento/bitacora/elevators-emergency-call',
          name: 'Reporte de elevadores',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'Asistente',
            'SuperUsuario',
          ]),
          label: 'Refacciones Elevadores',
          routerLink: '/mantenimiento/bitacora/elevator-spare-parts-change',
          name: 'Cambio de refacciones elevadores',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
      ]),
      label: 'Inventarios',
      icon: 'fa-thin fa-boxes-stacked',
      routerLink: '/mantenimiento/panel-inventories',
      name: 'inventarios',
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'Colaborador',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'Sistemas',
        'SuperUsuario',
      ]),
      label: '5.4-Inventarios',
      icon: 'fa-thin fa-boxes-stacked',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Amenidades',
          routerLink: '/mantenimiento/inventario/equipos/2',
          name: 'Inventarios-Equipos',
        },

        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Áreas Comunes',
          routerLink: '/mantenimiento/inventario/equipos/8',
          name: 'Inventarios-Areas comunes',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Cuartos de Maquinas',
          routerLink: '/mantenimiento/inventario/equipos/7',
          name: 'Inventarios-Cuartos de maquinas',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Mobiliario',
          routerLink: '/mantenimiento/inventario/equipos/3',
          name: 'Inventarios-Mobiliarios',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Llaves',
          routerLink: '/mantenimiento/inventario/llaves',
          name: 'Inventarios-Llaves',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Herramientas',
          routerLink: '/mantenimiento/inventario/herramienta',
          name: 'Inventarios-Herramienta',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Radios',
          routerLink: '/mantenimiento/inventario/radios',
          name: 'Inventarios-Radios',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'Sistemas',
            'SuperUsuario',
          ]),
          label: 'EQ. Sistemas',
          routerLink: '/mantenimiento/inventario/equipos/6',
          name: 'Inventarios-Equipos de sistemas',
        },

        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Equipos electromecánicos',
          routerLink: '/mantenimiento/inventario/equipos/1',
          name: 'Inventarios-Equipos electromecanicos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Equipos de Gimnasio',
          routerLink: '/mantenimiento/inventario/equipos/5',
          name: 'Inventarios-Equipos de gimnasio',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Extintores',
          routerLink: '/mantenimiento/catalogo/extintores',
          name: 'Inventarios-Extintores',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Extintores Grupo',
          routerLink: '/mantenimiento/catalogo/extintores-group',
          name: 'Inventarios-Extintores',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'EQ. Iluminación',
          routerLink: '/mantenimiento/catalogo/iluminacion',
          name: 'Inventarios-Catalogo de iluminación',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Pintura Especificación',
          routerLink: '/mantenimiento/catalogo/pintura',
          name: 'Inventarios-Catalogo de pintura',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Almacén',
          routerLink: '/mantenimiento/almacen/inventario-productos',
          name: 'Inventarios-Almacen',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: '5.4.1-Mov. al almacén',
          items: [
            {
              visible: this.authS.onValidateRoles([
                'Asistente',
                'GerenteMantenimiento',
                'Mantenimiento',
                'Residente',
                'SuperUsuario',
              ]),
              label: 'Entradas de insumos',
              routerLink: '/mantenimiento/almacen/entrada-productos',
              name: 'Inventarios-Entradas de insumos',
            },
            {
              visible: this.authS.onValidateRoles([
                'Asistente',
                'GerenteMantenimiento',
                'Mantenimiento',
                'Residente',
                'SuperUsuario',
              ]),
              label: 'Salidas de insumos',
              routerLink: '/mantenimiento/almacen/salida-productos',
              name: 'Inventarios-Salida de insumos',
            },
            {
              visible: this.authS.onValidateRoles([
                'GerenteMantenimiento',
                'Mantenimiento',
                'Residente',
                'SuperUsuario',
              ]),
              label: 'Préstamo de herramientas',
              routerLink: '/mantenimiento/bitacora/prestamo-herramienta',
              name: 'Inventarios-Préstamo de herramientas',
            },
          ],
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Polizas de Mtto',
          routerLink: '/documento/poliza',
          name: 'Inventarios-Polizas de mantenimiento',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Documentos',
          routerLink: '/documento/documento',
          name: 'Inventarios-Documentos',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '5.5-Capacitación',
      icon: 'fa-thin fa-book-open-reader',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Nomenclatura',
          routerLink: '/capacitacion/nomenclatura',
          name: 'Capacitación-Nomenclatura',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Manuales y procesos',
          routerLink: '/capacitacion/procesos',
          name: 'Capacitación-Manuales y procesos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Formatos',
          routerLink: '/capacitacion/formatos',
          name: 'Capacitación-Formatos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Comunicados internos',
          routerLink: '/capacitacion/comunicado',
          name: 'Capacitación-Comunicados internos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Mttos Preventivos',
          routerLink: '/operaciones/calendario/mantenimiento-master',
          name: 'Calendario-Mantenimientos preventivos',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Calendario Maestro Equipo',
          routerLink: '/operaciones/calendario/calendario-maestro-equipo',
          name: 'Capacitación-Guia calendario general de mtto',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Calendario',
          routerLink: '/operaciones/calendario/custom-calendar-events',
          name: 'custom-calendar-events',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '5.6-Calendarios',
      icon: 'fa-thin fa-calendar-days',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Contador',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Fondeos',
          routerLink: '/operaciones/calendario/fondeos',
          name: 'Calendario-Fondeos',
        },
        {
          visible: this.authS.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Mtto Preventivo',
          routerLink: '/mantenimiento/calendario-anual',
          name: 'Calendario-Mantenimiento preventivo',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Fiestas Judías',
          routerLink: '/operaciones/calendario/fiestas-judias',
          name: 'Calendario-Fiestaws judias',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Fiestas Catolicas',
          routerLink: '/operaciones/calendario/fiestas-cristianas',
          name: 'Calendario-Fiestaws catolicas',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Contador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Cumpleaños',
          routerLink: '/operaciones/calendario/cumpleanos',
          name: 'Calendario-Cumpleaños',
        },
      ],
    },

    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '6.1-Directorios',
      icon: 'fa-thin fa-address-book',
      items: [
        {
          visible: this.authS.onValidateRoles(['Residente', 'SuperUsuario']),
          label: 'Organigrama',
          routerLink: '/directorio/organigrama-interno',
          name: 'Directorio-Organigrama interno',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Clientes',
          routerLink: '/settings/clientes',
          name: 'Directorio-Clientes',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Propiedades',
          routerLink: '/directorio/propiedades',
          name: 'Directorio-Propiedades',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Condominos',
          routerLink: '/directorio/condominos',
          name: 'Directorio-Condominos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Comité de vigilancia',
          routerLink: '/directorio/comite-vigilancia',
          name: 'Directorio-Comité de vigilancia',
        },

        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Personal Interno',
          routerLink: '/directorio/personal-interno',
          name: 'Directorio-Empleados internos',
        },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Proveedores',
          routerLink: '/directorio/proveedor',
          name: 'Directorio-Proveedores',
        },

        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Personal Externo',
          routerLink: '/directorio/personal-externo',
          name: 'Directorio-Empleados externos',
        },
        // {
        //   visible: this.authService.onValidateRoles(['SuperUsuario']),
        //   label: 'Personal General',
        //   routerLink: '/directorio/empleados-general',
        //   name: 'Directorio-Todos los empleados',
        // },
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Emergencias',
          routerLink: '/directorio/telefonos-emergencia',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
      ]),
      label: '6.2-Utilidades',
      icon: 'fa-thin fa-screwdriver-wrench',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Calculadora IVA',
          routerLink: '/utilidades/calcular-iva',
          name: 'utilidades-Calculadora',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles([
        'Asistente',
        'Residente',
        'SuperUsuario',
        'Reclutamiento',
      ]),
      label: '7.0 Reclutamiento',
      icon: 'fa-thin fa-arrows-down-to-people',
      items: [
        {
          visible: this.authS.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
            'Reclutamiento',
          ]),
          label: 'Plantilla',
          routerLink: '/reclutamiento/plantilla-interna',
          name: 'Reclutamiento-Plantilla',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Residente',
            'Asistente',
          ]),
          label: 'Solicitudes',
          routerLink: '/reclutamiento/solicitudes_cliente',
          name: 'Reclutamiento-Solicitudes por cliente',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Solicitudes Recl',
          routerLink: '/reclutamiento/solicitudes/vacantes',
          name: 'Reclutamiento-Solicitudes a reclutamiento',
        },

        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Departamentos',
          routerLink: '/reclutamiento/departamentos',
          name: 'Reclutamiento-Departamentos de la empresa',
        },
        {
          visible: this.authS.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Profesiones',
          routerLink: '/catalog/jobs',
          name: 'Reclutamiento-Profesiones',
        },
      ],
    },
    {
      visible: true,
      label: 'Salir',
      icon: 'fa-thin fa-right-from-bracket',
      routerLink: '/auth/login',
    },
  ];
}
