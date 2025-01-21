import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { IMenuItem } from 'src/app/core/interfaces/menu.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogModule],
  templateUrl: './settings-home.component.html',
})
export default class SettingsHomeComponent {
  private authS = inject(AuthService);

  menuItems: IMenuItem[] = [
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: 'Administración de Usuarios',
      icon: 'fa-duotone fa-solid fa-user-tie',
      routerLink: '/accounts',
    },
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: 'Administración Roles Modulos',
      icon: 'fa-duotone fa-solid fa-layer-group',
      routerLink: '/settings/module-app-rol',
    },
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: 'Administración de Modulos',
      icon: 'fa-duotone fa-sliders-h',
      items: [
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Modulos a Clientes',
          routerLink: '/settings/customer-modul',
          name: 'customer-modul',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Catalogo de Modulos',
          routerLink: '/settings/module-app',
          name: 'module-app',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: '1.1 Catalogos',
      icon: 'fa-duotone fa-solid fa-album-collection',
      name: 'catalog',
      items: [
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.2 Roles',
          routerLink: '/catalog/roles',
          name: 'Roles',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.3 Bancos',
          routerLink: '/catalog/banks',
          name: 'bancos',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.4 Forma de pago',
          routerLink: '/catalog/forma-pago',
          name: 'forma de pago',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.5 Metodo de pago',
          routerLink: '/catalog/metodo-pago',
          name: 'metodo de pago',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.6 Uso de cfdi',
          routerLink: '/catalog/uso-cfdi',
          name: 'uso de cfdi',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.7 Catalogo de cuentas',
          routerLink: '/contabilidad/catalogo-cuentas',
          name: 'Cuentas',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.8 Departamentos de trabajo',
          routerLink: '/catalog/company-departaments',
          name: 'company-departaments',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.9 Profesiones',
          routerLink: '/catalog/jobs',
          name: 'jobs',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.10 Categorias ticket',
          routerLink: '/catalog/ticket-group-category',
          name: 'ticket group category',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.11 Categoria Medidor',
          routerLink: '/catalog/meter-category',
          name: 'meter category',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.12 Categoria productos',
          routerLink: '/catalog/product-category',
          name: 'product category',
        },

        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.13 Clasificacion equipos',
          routerLink: '/catalog/machinery-classification',
          name: 'machinery-classification',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.14 Unidades de medida',
          routerLink: '/catalog/units-of-measurement',
          name: 'units-of-measurement',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.15 Entrega Recepción',
          routerLink: '/catalog/entrega-recepcion-cliente',
          name: 'entrega recepcion',
        },

        // {
        //   visible: this.authS.onValidateRoles([
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
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.14 Calendario maestro mtto',
          routerLink: '/calendario/calendario-maestro-equipo',
          name: 'Capacitación-Guia calendario general de mtto',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.1.15 Catalogo de colores',
          routerLink: '/catalog/catalog-color',
          name: 'Catalogo de colores',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Catalogo de amenidades',
          routerLink: '/catalog/catalog-asset',
          name: 'Catalogo de amenidades',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Catalogo de inspecciones',
          routerLink: '/catalog/inspection-reviews-catalog',
          name: 'Catalogo de inspecciones',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: 'Home',
          routerLink: '/home',
          name: 'Home',
        },
      ],
    },
    {
      visible: this.authS.onValidateRoles(['SuperUsuario']),
      label: '1.2 Mails empresa',
      icon: 'fa-duotone fa-solid fa-envelope',
      name: 'Mails empresa',
      items: [
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.2.1 Emails corporativos',
          routerLink: '/settings/customer-data-company',
          name: 'customer-data-company',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.2.2 Datos de email',
          routerLink: '/settings/datos-email',
          name: 'datos de correos',
        },
        {
          visible: this.authS.onValidateRoles(['SuperUsuario']),
          label: '1.2.3 Depuración',
          routerLink: '/settings/depuration',
          name: 'depuration',
        },
      ],
    },
  ];

  selectedItem: IMenuItem | null = null;
  display: boolean = false; // Variable para controlar si el modal se muestra

  handleCardClick(item: IMenuItem): void {
    if (item.items && item.items.length > 0) {
      this.selectedItem = item;
      this.display = true; // Mostrar el modal con los subelementos
    } else if (item.routerLink) {
      // Navegación directa si no tiene subelementos.
    }
  }
}
