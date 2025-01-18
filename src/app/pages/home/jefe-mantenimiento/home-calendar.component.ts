import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IHomeListGroupComponent } from '../home-list-group/home-list-group.component';
import HomeMenuComponent from '../home-menu/home-menu.component';

@Component({
  selector: 'app-home-calendar',
  standalone: true,
  imports: [HomeMenuComponent],
  templateUrl: './home-calendar.component.html',
})
export default class HomeCalendarComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Mantenimiento',
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
      name: 'Reservaciones',
      icon: 'fa-duotone fa-calendar-check', // Ícono para calendario y reservas
      routerLink: '/mantenimiento/calendario-anual',
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
      name: 'Juntas de comité',
      icon: 'fa-duotone fa-users', // Ícono para reuniones de grupo o juntas
      routerLink: '/mantenimiento/calendario-anual',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
