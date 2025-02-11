import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeMenuComponent from '../home-menu/home-menu.component';

@Component({
    selector: 'app-home-calendar',
    imports: [HomeMenuComponent],
    templateUrl: './home-calendar.component.html'
})
export default class HomeCalendarComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Mantenimiento',
      icon: 'fa-duotone fa-tools', // Ícono para herramientas y mantenimiento
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
      label: 'Reservaciones',
      icon: 'fa-duotone fa-calendar-check', // Ícono para calendario y reservas
      routerLink: '/mantenimiento/calendario-anual',
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
      label: 'Juntas de comité',
      icon: 'fa-duotone fa-users', // Ícono para reuniones de grupo o juntas
      routerLink: '/home-calendar-juntas-comite',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
