import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../sidebar/menu.model';

@Injectable({
  providedIn: 'root',
})
export class HomeMenuService {
  private authS = inject(AuthService);
  superUsuario = 'SuperUsuario';
  condomino = 'Condomino';
  supervisionOperativa = 'SupervisionOperativa';
  administrador = 'Administrador';
  asistente = 'Asistente';
  jefeMantenimiento = 'JefeMantenimiento';
  auxiliarMantenimiento = 'AuxiliarMantenimiento';
  seguridad = 'Seguridad';
  limpieza = 'Limpieza';
  jardineria = 'Jardineria';

  // 'SuperUsuario',
  // 'Condomino',
  // 'SupervisionOperativa',
  // 'Administrador',
  // 'Asistente',
  // 'JefeMantenimiento',
  // 'AuxiliarMantenimiento',
  // 'Seguridad',
  // 'Limpieza',
  // 'Jardineria',

  legal = 'Legal';
  sistemas = 'Sistemas';
  contador = 'Contador';
  cobranza = 'Cobranza';
  reclutamiento = 'Reclutamiento';

  get onLoadMenu() {
    return this.menu;
  }
  menu: IMenuItem[] = [
    {
      icon: 'fa-solid fa-users', // Ícono de almacén
      label: 'Usuarios',
      routerLink: '/settings/application-user',
      visible: this.authS.onValidateRoles(['SuperUsuario']),
    },
    {
      icon: 'fa-duotone fa-tickets',
      label: 'Tickets',
      routerLink: '/home-ticket',
      visible: true,
    },
    {
      icon: 'fa-solid fa-search', // O cualquier otro ícono relacionado con inspecciones
      label: 'Inspecciones',
      routerLink: '/home-inspection',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
        'Seguridad',
        'Limpieza',
        'Jardineria',
      ]),
    },

    {
      icon: 'fa-solid fa-clipboard-list',
      label: 'Bitacoras',
      routerLink: '/home-bitacoras',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-warehouse-full',
      label: 'Inventarios',
      routerLink: '/home-inventory',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-calendar',
      label: 'Calendarios',
      routerLink: '/home-calendar',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
        'Seguridad',
        'Limpieza',
      ]),
    },
    {
      icon: 'fa-solid fa-warehouse', // Ícono de almacén
      label: 'Almacenes',
      routerLink: '/home-warehouses',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-solid fa-users-viewfinder', // Ícono de usuarios o reuniones
      label: 'Juntas con comité',
      routerLink: '/home-juntas-comite',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },

    {
      icon: 'fa-duotone fa-books',
      label: 'Biblioteca de documentos',
      routerLink: '/home-documents',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-address-book', // Ícono para un directorio de contactos
      label: 'Directorios',
      routerLink: '/home-directorios',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },

    {
      icon: 'fa-solid fa-cart-shopping', // Ícono de carrito de compras
      label: 'Compras',
      routerLink: '/home-compras',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-solid fa-chart-bar', // Ícono de gráfico de barras
      label: 'Reportes',
      routerLink: '/home-reports',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-solid fa-qrcode', // Ícono de código QR
      label: 'Pase QR',
      routerLink: '/home-reports',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      icon: 'fa-solid fa-calendar-days', // Ícono de calendario para reservaciones
      label: 'Reservaciones',
      routerLink: '/home-reports',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      icon: 'fa-solid fa-box', // Ícono de paquete para paquetería
      label: 'Paqueteria',
      routerLink: '/home-reports',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      icon: 'fa-solid fa-id-badge', // Ícono de credencial para permisos de personal
      label: 'Permisos de personal',
      routerLink: '/home-reports',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
