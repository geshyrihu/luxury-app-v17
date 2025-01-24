import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IHomeListGroupComponent } from '../home-list-group/home-list-group.component';
import HomeMenuComponent from '../home-menu/home-menu.component';

@Component({
  selector: 'app-home-warehouses',
  standalone: true,
  imports: [HomeMenuComponent],
  templateUrl: './home-warehouses.component.html',
})
export default class HomeWarehousesComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Herramienta',
      icon: 'fa-duotone fa-tools', // Ícono para herramientas y mantenimiento
      routerLink: '/mantenimiento/calendario-anual',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Almacen 1',
      icon: 'fa-duotone fa-boxes-stacked', // Ícono para herramientas y mantenimiento
      routerLink: '/mantenimiento/calendario-anual',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Almacen 2',
      icon: 'fa-duotone fa-boxes-stacked', // Ícono para calendario y reservas
      routerLink: '/mantenimiento/calendario-anual',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Almacen 3',
      icon: 'fa-duotone fa-boxes-stacked', // Ícono para reuniones de grupo o juntas
      routerLink: '/mantenimiento/calendario-anual',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
  ];
}
