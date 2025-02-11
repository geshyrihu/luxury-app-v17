import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
    selector: 'app-home-reports',
    imports: [HomeListGroupComponent],
    templateUrl: './home-reports.component.html'
})
export default class HomeReportsComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Mantenimientos Preventivos',
      icon: 'fa-solid fa-tools', // Representa herramientas de mantenimiento
      routerLink: '/mantenimientos-preventivos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Tickets Operativos',
      icon: 'fa-solid fa-ticket-alt', // Representa gestión de tickets
      routerLink: '/tickets-operativos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Estados Financieros',
      icon: 'fa-solid fa-file-invoice-dollar', // Representa informes financieros
      routerLink: '/estados-financieros',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Presentaciones Juntas de Comité',
      icon: 'fa-solid fa-briefcase', // Representa reuniones o juntas
      routerLink: '/junta-comite/presentaciones',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Pendientes de Minutas',
      icon: 'fa-solid fa-clipboard-list', // Representa tareas pendientes o minutas
      routerLink: '/pendientes-minutas',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Inspecciones',
      icon: 'fa-solid fa-search', // Representa inspecciones o revisiones
      routerLink: '/inspecciones',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Incidentes Elevadores',
      icon: 'fa-solid fa-elevator', // Representa incidentes relacionados con elevadores
      routerLink: '/incidentes-elevadores',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Mtto Albercas',
      icon: 'fa-solid fa-water', // Representa mantenimiento de piscinas
      routerLink: '/mtto-albercas',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Consumos',
      icon: 'fa-solid fa-chart-pie', // Representa análisis o registro de consumos
      routerLink: '/consumos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Solicitudes de Compra',
      icon: 'fa-solid fa-cart-shopping', // Representa compras o solicitudes de compra
      routerLink: '/solicitudes-compra',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Tickets Legal',
      icon: 'fa-solid fa-scale-balanced', // Representa legalidad o justicia
      routerLink: '/solicitudes-compra',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
