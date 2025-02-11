import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeMenuComponent from '../home-menu/home-menu.component';

@Component({
    selector: 'app-home-warehouses',
    imports: [HomeMenuComponent],
    templateUrl: './home-warehouses.component.html'
})
export default class HomeWarehousesComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Herramienta',
      icon: 'fa-duotone fa-tools', // Ícono para herramientas y mantenimiento
      routerLink: '/almacen/prestamo-herramienta',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Productos',
      icon: 'fa-duotone fa-boxes-stacked', // Ícono para herramientas y mantenimiento
      routerLink: '/almacen/inventario-productos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Almacen 2',
      icon: 'fa-duotone fa-boxes-stacked', // Ícono para calendario y reservas
      routerLink: '/mantenimiento/calendario-anual',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Almacen 3',
      icon: 'fa-duotone fa-boxes-stacked', // Ícono para reuniones de grupo o juntas
      routerLink: '/mantenimiento/calendario-anual',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
  ];
}
