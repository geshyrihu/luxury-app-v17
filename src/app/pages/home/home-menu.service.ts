import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IHomeListGroupComponent } from './home-list-group/home-list-group.component';

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
  menu: IHomeListGroupComponent[] = [
    {
      icon: 'fa-solid fa-users', // Ícono de almacén
      name: 'Usuarios',
      routerLink: '/accounts',
      isAutorized: this.authS.onValidateRoles(['SuperUsuario']),
    },
    {
      icon: 'fa-duotone fa-tickets',
      name: 'Tickets',
      routerLink: '/home-ticket',
      isAutorized: true,
    },
    {
      icon: 'fa-solid fa-search', // O cualquier otro ícono relacionado con inspecciones
      name: 'Inspecciones',
      routerLink: '/home-inspection',
      isAutorized: this.authS.onValidateRoles([
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
      name: 'Bitacoras',
      routerLink: '/home-bitacoras',
      isAutorized: this.authS.onValidateRoles([
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
      name: 'Inventarios',
      routerLink: '/home-inventory',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-calendar',
      name: 'Calendarios',
      routerLink: '/home-calendar',
      isAutorized: this.authS.onValidateRoles([
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
      name: 'Almacenes',
      routerLink: '/home-warehouses',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-solid fa-users-viewfinder', // Ícono de usuarios o reuniones
      name: 'Juntas con comité',
      routerLink: '/home-juntas-comite',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },

    {
      icon: 'fa-duotone fa-books',
      name: 'Biblioteca de documentos',
      routerLink: '/home-documents',
      isAutorized: this.authS.onValidateRoles([
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
      name: 'Directorios',
      routerLink: '/home-directorios',
      isAutorized: this.authS.onValidateRoles([
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
      name: 'Compras',
      routerLink: '/home-compras',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-solid fa-chart-bar', // Ícono de gráfico de barras
      name: 'Reportes',
      routerLink: '/home-reports',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-solid fa-qrcode', // Ícono de código QR
      name: 'Pase QR',
      routerLink: '/home-reports',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      icon: 'fa-solid fa-calendar-days', // Ícono de calendario para reservaciones
      name: 'Reservaciones',
      routerLink: '/home-reports',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      icon: 'fa-solid fa-box', // Ícono de paquete para paquetería
      name: 'Paqueteria',
      routerLink: '/home-reports',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      icon: 'fa-solid fa-id-badge', // Ícono de credencial para permisos de personal
      name: 'Permisos de personal',
      routerLink: '/home-reports',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
