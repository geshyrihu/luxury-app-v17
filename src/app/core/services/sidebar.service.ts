import { Injectable, inject } from '@angular/core';
import { MenuItem } from '../interfaces/menu.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private authService = inject(AuthService);

  get onLoadMenu() {
    return this.menu;
  }
  menu: MenuItem[] = [
    {
      visible: this.authService.onValidateRoles(['SuperUsuario']),
      label: 'Configuración',
      icon: 'fa-thin fa-gear',
      link: 'configuracion/panel',
      name: 'Configuración',
    },
    {
      visible: this.authService.onValidateRoles(['Residente']),
      label: 'Accesos',
      icon: 'fa-thin fa-key',
      link: 'accounts/cliente',
      name: 'Accesos',
    },
    {
      visible: this.authService.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'Sistemas',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: 'Mi Edificio',
      icon: 'fa-thin fa-building',
      link: 'operaciones/mi-edificio',
      name: 'Mi edificio',
    },
    {
      visible: this.authService.onValidateRoles(['Legal', 'SuperUsuario']),
      label: '1.-Legal',
      icon: 'fa-thin fa-gavel',
      subItems: [
        {
          visible: this.authService.onValidateRoles(['Legal', 'SuperUsuario']),
          label: 'Minutas',
          link: 'contabilidad/pendientes-minutas-legal',
          name: 'Legal-Minutas',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Contador',
        'SuperUsuario',
        'SupervisorContable',
      ]),
      label: '2.-Contabilidad',
      icon: 'fa-thin fa-hand-holding-dollar',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Contador',
            'SuperUsuario',
            'SupervisorContable',
          ]),
          label: 'Presentaciones',
          link: 'operaciones/presentacion-junta-comite/presentaciones',
          name: 'Contabilidad-Presentaciones',
        },
        {
          visible: this.authService.onValidateRoles([
            'Contador',
            'SuperUsuario',
          ]),
          label: 'Minutas',
          link: 'contabilidad/pendientes-minutas',
          name: 'Contabilidad-Pendientes-Minutas',
        },
        {
          visible: this.authService.onValidateRoles([
            'Contador',
            'SuperUsuario',
          ]),
          label: 'Presupuesto',
          link: 'operaciones/compras/cedula-cliente',
          name: 'Contabilidad-Presupuesto',
        },
        {
          visible: this.authService.onValidateRoles([
            'Contador',
            'SuperUsuario',
          ]),
          label: 'Reporte Envio Financieros',
          link: 'contabilidad/reporte-envio-financieros',
          name: 'Reporte-Envio-Financieros',
        },

        {
          visible: this.authService.onValidateRoles(['SuperUsuario']),
          label: 'Catalogo de Cuentas',
          subItems: [
            {
              visible: this.authService.onValidateRoles(['SuperUsuario']),
              label: 'Cuentas 1er Nivel',
              link: '/contabilidad/catalogo-cuentas-primer-nivel',
              name: 'Cuentas 1er Nivel',
            },
            {
              visible: this.authService.onValidateRoles(['SuperUsuario']),
              label: 'Cuentas 2do Nivel',
              link: '/contabilidad/catalogo-cuentas-segundo-nivel',
              name: 'Cuentas 2do Nivel',
            },
            {
              visible: this.authService.onValidateRoles(['SuperUsuario']),
              label: 'Cuentas',
              link: '/contabilidad/catalogo-cuentas',
              name: 'Cuentas',
            },
          ],
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Direccion',
        'GerenteMantenimiento',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '3.-Op-Supervisión',
      icon: 'fa-thin fa-user-tie',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Direccion',
            'GerenteMantenimiento',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Bitácora Diaria',
          link: '/supervision/bitacora-diaria',
          name: 'Supervisión-Bitacora Diaria',
        },
        {
          visible: this.authService.onValidateRoles([
            'Direccion',
            'GerenteMantenimiento',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Resultado General',
          link: '/supervision/resultado-general-dashboard',
          name: 'Supervisión-Resultado General',
        },
        {
          visible: this.authService.onValidateRoles([
            'Direccion',
            'GerenteMantenimiento',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Reporte Presentaciones',
          link: '/supervision/presentaciones-juntas-comite',
          name: 'Supervisión-Reporte presentaciónes juntas de comité',
        },
        {
          visible: this.authService.onValidateRoles([
            'Direccion',
            'GerenteMantenimiento',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Reporte Minutas',
          link: '/supervision/minutas-resumen',
          name: 'Supervisión-Reporte minutas',
        },
        {
          visible: this.authService.onValidateRoles([
            'Direccion',
            'GerenteMantenimiento',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Reporte Ticket',
          link: '/supervision/reporte-tickets',
          name: 'Supervisión-Reporte tickets',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'SuperUsuario',
          ]),
          label: 'Entrega Recepción',
          subItems: [
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'General',
              link: 'entrega-recepcion/general',
              name: 'Supervisión-Entrega recepción',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Equipos',
              link: 'operaciones/entrega-recepcion/equipos',
              name: 'Supervisión-Entrega recepción-Equipos',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Instalaciones',
              link: 'operaciones/entrega-recepcion/instalaciones',
              name: 'Supervisión-Entrega recepción-Instalaciones',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Extintores',
              link: 'operaciones/entrega-recepcion/hidrantes',
              name: 'Supervisión-Entrega recepción-Hidrantes',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Llaves',
              link: 'operaciones/entrega-recepcion/llaves',
              name: 'Supervisión-Entrega recepción-Llaves',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Herramientas',
              link: 'operaciones/entrega-recepcion/herramientas',
              name: 'Supervisión-Entrega recepción-Herramientas',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Mantenimientos',
              link: 'operaciones/entrega-recepcion/mantenimientos',
              name: 'Supervisión-Entrega recepción-Mantenimientos',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Pendientes',
              link: 'operaciones/entrega-recepcion/mantenimientos-pendientes',
              name: 'Supervisión-Entrega recepción-Pendientes',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Organigrama',
              link: 'operaciones/entrega-recepcion/organigrama',
              name: 'Supervisión-Entrega recepción-Organigrama',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Planos',
              link: 'operaciones/entrega-recepcion/planos',
              name: 'Supervisión-Entrega recepción-Planos',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'SuperUsuario',
              ]),
              label: 'Insumos',
              link: 'operaciones/entrega-recepcion/insumos',
              name: 'Supervisión-Entrega recepción-Insumos',
            },
          ],
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles(['Sistemas', 'SuperUsuario']),
      label: '4.-Sistemas',
      icon: 'fa-thin fa-laptop-code',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Sistemas',
            'SuperUsuario',
          ]),
          label: 'Tickets',
          link: 'sistemas/reportes',
          name: 'Sistemas-Tickets',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
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
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Direccion',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Resumen',
          link: 'inicio/dashboard',
          name: 'Operaciones-Pendientes',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Presentacion JC',
          link: 'operaciones/presentacion-junta-comite/presentaciones',
          name: 'Operaciones-Presentaciones juntas de comité',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Minutas',
          link: 'operaciones/junta-comite/minutas',
          name: 'Operaciones-Minuta',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Mtto Preventivo',
          link: 'reporte/mantenimiento-preventivo',
          name: 'Operaciones-Mantenimientos preventivos',
        },
        {
          visible: this.authService.onValidateRoles(['SuperUsuario']),

          label: 'Tickets V2',
          link: 'operaciones/reporte/tiket-mantenimiento-v2',
          name: 'Operaciones-Tickets-v2',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),

          label: 'Tickets',
          link: 'operaciones/reporte/tiket-mantenimiento',
          name: 'Operaciones-Tickets',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),

          label: 'Reportes',
          link: 'operaciones/reportes-mantenimiento/panel',
          name: 'Operaciones-Reporte general mensual de manteniento',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'SuperUsuario',
        'Mantenimiento',
        'Asistente',
        'Mantenimiento',
        'Residente',
      ]),
      label: '5.2-Compras',
      icon: 'fa-thin fa-bag-shopping',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
            'Contador',
          ]),

          // Se va a editar y se mostraran todos los presupuestos
          label: 'Ultimo Presupuesto',
          link: 'operaciones/compras/cedula-cliente',
          name: 'Compras-Cedula presupuestal',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
            'Contador',
          ]),

          // Se va a editar y se mostraran todos los presupuestos
          label: 'Presupuestos',
          // link: 'operaciones/compras/cedula-cliente',
          link: 'operaciones/compras/presupuestos',
          name: 'Compras-Cedula presupuestal',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Residente',
          ]),

          // Se va a editar y se mostraran todos los presupuestos
          label: 'Cuentas Mtto',
          // link: 'operaciones/compras/cedula-cliente',
          link: 'operaciones/compras/mtto-presupuesto',
          name: 'Compras-Cuentas Mtto',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
          ]),

          label: 'Productos y servicios',
          link: 'mantenimiento/catalogo/productos-servicios',
          name: 'Compras-Productos y servicios',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Asistente',
            'Mantenimiento',
            'Residente',
          ]),
          label: 'Solicitud compra',
          link: 'operaciones/compras/solicitudes-compra',
          name: 'Compras-Solicitudes de compra',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'Mantenimiento',
          ]),
          label: 'OC Fijos',
          link: 'operaciones/compras/ordenes-compra-fijos',
          name: 'Compras-ordenes de compra gastos fijos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'Mantenimiento',
          ]),
          label: 'OC Variables',
          link: 'operaciones/compras/ordenes-compra',
          name: 'Compras-ordenes de compra gastos variables',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Catalogo OC Fijos',
          link: 'operaciones/compras/catalogo-gastos-fijos',
          name: 'Compras-catalogo ordenes de compra gastos fijos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'OC Pagadas',
          link: 'operaciones/compras/pagadas',
          name: 'Compras-ordenes de compra pagadas',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'SuperUsuario',
        'Colaborador',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
      ]),
      label: '5.3-Bitacoras Mtto',
      icon: 'fa-thin fa-book',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
          ]),
          label: 'Recorrido diario',
          link: 'mantenimiento/bitacora/recorrido',
          name: 'Bitacoras-mantenimiento recorrido diario',
        },
        {
          visible: this.authService.onValidateRoles([
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Consumos lecturas',
          link: 'mantenimiento/bitacora/lista-medidor',
          name: 'Bitacoras-medidores gas, agua y luz',
        },
        {
          visible: this.authService.onValidateRoles([
            'Colaborador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Albercas',
          link: 'mantenimiento/bitacora/piscina',
          name: 'Bitacoras-alberca',
        },
      ],
    },

    {
      visible: this.authService.onValidateRoles([
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
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Amenidades',
          link: 'mantenimiento/inventario/equipos/2',
          name: 'Inventarios-Equipos',
        },

        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Áreas Comunes',
          link: 'mantenimiento/inventario/equipos/8',
          name: 'Inventarios-Areas comunes',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Cuartos de Maquinas',
          link: 'mantenimiento/inventario/equipos/7',
          name: 'Inventarios-Cuartos de maquinas',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Mobiliario',
          link: 'mantenimiento/inventario/equipos/3',
          name: 'Inventarios-Mobiliarios',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Llaves',
          link: 'mantenimiento/inventario/llaves',
          name: 'Inventarios-Llaves',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Herramientas',
          link: 'mantenimiento/inventario/herramienta',
          name: 'Inventarios-Herramienta',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Radios',
          link: 'mantenimiento/inventario/radios',
          name: 'Inventarios-Radios',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'Sistemas',
            'SuperUsuario',
          ]),
          label: 'EQ. Sistemas',
          link: 'mantenimiento/inventario/equipos/6',
          name: 'Inventarios-Equipos de sistemas',
        },

        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Equipos electromecánicos',
          link: 'mantenimiento/inventario/equipos/1',
          name: 'Inventarios-Equipos electromecanicos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Equipos de Gimnasio',
          link: 'mantenimiento/inventario/equipos/5',
          name: 'Inventarios-Equipos de gimnasio',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Extintores',
          link: 'mantenimiento/catalogo/extintores',
          name: 'Inventarios-Extintores',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'EQ. Iluminación',
          link: 'mantenimiento/catalogo/iluminacion',
          name: 'Inventarios-Catalogo de iluminación',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Pintura Especificación',
          link: 'mantenimiento/catalogo/pintura',
          name: 'Inventarios-Catalogo de pintura',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Almacén',
          link: 'mantenimiento/almacen/inventario-productos',
          name: 'Inventarios-Almacen',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: '5.4.1-Mov. al almacén',
          subItems: [
            {
              visible: this.authService.onValidateRoles([
                'Asistente',
                'GerenteMantenimiento',
                'Mantenimiento',
                'Residente',
                'SuperUsuario',
              ]),
              label: 'Entradas de insumos',
              link: 'mantenimiento/almacen/entrada-productos',
              name: 'Inventarios-Entradas de insumos',
            },
            {
              visible: this.authService.onValidateRoles([
                'Asistente',
                'GerenteMantenimiento',
                'Mantenimiento',
                'Residente',
                'SuperUsuario',
              ]),
              label: 'Salidas de insumos',
              link: 'mantenimiento/almacen/salida-productos',
              name: 'Inventarios-Salida de insumos',
            },
            {
              visible: this.authService.onValidateRoles([
                'GerenteMantenimiento',
                'Mantenimiento',
                'Residente',
                'SuperUsuario',
              ]),
              label: 'Préstamo de herramientas',
              link: 'mantenimiento/bitacora/prestamo-herramienta',
              name: 'Inventarios-Préstamo de herramientas',
            },
          ],
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Polizas de Mtto',
          link: 'documento/poliza',
          name: 'Inventarios-Polizas de mantenimiento',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Documentos',
          link: 'documento/documento',
          name: 'Inventarios-Documentos',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '5.5-Capacitación',
      icon: 'fa-thin fa-book-open-reader',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Nomenclatura',
          link: 'capacitacion/nomenclatura',
          name: 'Capacitación-Nomenclatura',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Manuales y procesos',
          link: 'capacitacion/procesos',
          name: 'Capacitación-Manuales y procesos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Formatos',
          link: 'capacitacion/formatos',
          name: 'Capacitación-Formatos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Comunicados internos',
          link: 'capacitacion/comunicado',
          name: 'Capacitación-Comunicados internos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Mttos Preventivos',
          link: 'operaciones/calendario/mantenimiento-master',
          name: 'Calendario-Mantenimientos preventivos',
        },
        {
          visible: this.authService.onValidateRoles(['SuperUsuario']),
          label: 'Calendario Maestro Equipo',
          link: 'operaciones/calendario/calendario-maestro-equipo',
          name: 'Capacitación-Guia calendario general de mtto',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '5.6-Calendarios',
      icon: 'fa-thin fa-calendar-days',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Contador',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Fondeos',
          link: 'operaciones/calendario/fondeos',
          name: 'Calendario-Fondeos',
        },
        {
          visible: this.authService.onValidateRoles([
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Mtto Preventivo',
          link: 'mantenimiento/calendario-anual',
          name: 'Calendario-Mantenimiento preventivo',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Fiestas Judías',
          link: 'operaciones/calendario/fiestas-judias',
          name: 'Calendario-Fiestaws judias',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Fiestas Catolicas',
          link: 'operaciones/calendario/fiestas-cristianas',
          name: 'Calendario-Fiestaws catolicas',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Contador',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Cumpleaños',
          link: 'operaciones/calendario/cumpleanos',
          name: 'Calendario-Cumpleaños',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles(['SuperUsuario']),
      label: '5.7 Comunicados',
      icon: 'fa-thin fa-file-pdf',
      subItems: [
        {
          visible: this.authService.onValidateRoles(['SuperUsuario']),
          label: 'Enviar Email',
          link: 'comunicacion/enviar-comunicado',
          name: 'Calendario-Enviar comunicado',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Asistente',
        'GerenteMantenimiento',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
        'SupervisionOperativa',
      ]),
      label: '6.1-Directorios',
      icon: 'fa-thin fa-address-book',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Organigrama',
          link: 'directorio/organigrama-interno',
          name: 'Directorio-Organigrama interno',
        },
        {
          visible: this.authService.onValidateRoles(['SuperUsuario']),
          label: 'Clientes',
          link: 'configuracion/clientes',
          name: 'Directorio-Clientes',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Propiedades',
          link: 'directorio/propiedades',
          name: 'Directorio-Propiedades',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Condominos',
          link: 'directorio/condominos',
          name: 'Directorio-Condominos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Comité de vigilancia',
          link: 'directorio/comite-vigilancia',
          name: 'Directorio-Comité de vigilancia',
        },

        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Personal Interno',
          link: 'directorio/empleados/interno',
          name: 'Directorio-Empleados internos',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Proveedores',
          link: 'directorio/proveedor',
          name: 'Directorio-Proveedores',
        },

        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Personal Externo',
          link: 'directorio/empleados/externo',
          name: 'Directorio-Empleados externos',
        },
        {
          visible: this.authService.onValidateRoles(['SuperUsuario']),
          label: 'Personal General',
          link: 'directorio/empleados-general',
          name: 'Directorio-Todos los empleados',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'GerenteMantenimiento',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Emergencias',
          link: 'directorio/telefonos-emergencia',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Asistente',
        'Mantenimiento',
        'Residente',
        'SuperUsuario',
      ]),
      label: '6.2-Utilidades',
      icon: 'fa-thin fa-screwdriver-wrench',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Mantenimiento',
            'Residente',
            'SuperUsuario',
          ]),
          label: 'Calculadora IVA',
          link: 'utilidades/calcular-iva',
          name: 'utilidades-Calculadora',
        },
      ],
    },
    {
      visible: this.authService.onValidateRoles([
        'Asistente',
        'Residente',
        'SuperUsuario',
        'Reclutamiento',
      ]),
      label: '7.0 Reclutamiento',
      icon: 'fa-thin fa-arrows-down-to-people',
      subItems: [
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Plantilla',
          link: 'reclutamiento/plantilla-interna',
          name: 'Reclutamiento-Plantilla',
        },
        {
          visible: this.authService.onValidateRoles([
            'Asistente',
            'Residente',
            'SuperUsuario',
            'SupervisionOperativa',
          ]),
          label: 'Agenda Entrevistas',
          link: 'reclutamiento/agenda-entrevistas',
          name: 'agenda entrevistas',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Residente',
            'Asistente',
          ]),
          label: 'Solicitudes',
          link: 'reclutamiento/solicitudes_cliente',
          name: 'Reclutamiento-Solicitudes por cliente',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Solicitudes Recl',
          link: 'reclutamiento/solicitudes/vacantes',
          name: 'Reclutamiento-Solicitudes a reclutamiento',
        },

        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Departamentos',
          link: 'reclutamiento/departamentos',
          name: 'Reclutamiento-Departamentos de la empresa',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Profesiones',
          link: 'reclutamiento/profesiones',
          name: 'Reclutamiento-Profesiones',
        },
        {
          visible: this.authService.onValidateRoles([
            'SuperUsuario',
            'Reclutamiento',
          ]),
          label: 'Candidatos',
          link: 'reclutamiento/candidatos',
          name: 'Reclutamiento-Candidatos',
        },
      ],
    },
    {
      visible: true,
      label: 'Salir',
      icon: 'fa-thin fa-right-from-bracket',
      link: 'auth/login',
    },
  ];
}
