import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-reports',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-reports.component.html',
})
export default class HomeReportsComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Mantenimientos Preventivos',
      icon: 'fa-solid fa-tools', // Representa herramientas de mantenimiento
      routerLink: '/mantenimientos-preventivos',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Tickets Operativos',
      icon: 'fa-solid fa-ticket-alt', // Representa gestión de tickets
      routerLink: '/tickets-operativos',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Estados Financieros',
      icon: 'fa-solid fa-file-invoice-dollar', // Representa informes financieros
      routerLink: '/estados-financieros',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Presentaciones Juntas de Comité',
      icon: 'fa-solid fa-briefcase', // Representa reuniones o juntas
      routerLink: '/presentaciones-comite',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Pendientes de Minutas',
      icon: 'fa-solid fa-clipboard-list', // Representa tareas pendientes o minutas
      routerLink: '/pendientes-minutas',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Inspecciones',
      icon: 'fa-solid fa-search', // Representa inspecciones o revisiones
      routerLink: '/inspecciones',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Incidentes Elevadores',
      icon: 'fa-solid fa-elevator', // Representa incidentes relacionados con elevadores
      routerLink: '/incidentes-elevadores',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Mtto Albercas',
      icon: 'fa-solid fa-water', // Representa mantenimiento de piscinas
      routerLink: '/mtto-albercas',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Consumos',
      icon: 'fa-solid fa-chart-pie', // Representa análisis o registro de consumos
      routerLink: '/consumos',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Solicitudes de Compra',
      icon: 'fa-solid fa-cart-shopping', // Representa compras o solicitudes de compra
      routerLink: '/solicitudes-compra',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Tickets Legal',
      icon: 'fa-solid fa-scale-balanced', // Representa legalidad o justicia
      routerLink: '/solicitudes-compra',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
