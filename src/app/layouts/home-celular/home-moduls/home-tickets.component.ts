import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
    selector: 'app-home-tickets',
    imports: [HomeListGroupComponent],
    templateUrl: './home-tickets.component.html'
})
export default class HomeTicketsComponent {
  authS = inject(AuthService);

  data: IMenuItem[] = [
    {
      label: 'Grupos de trabajo',
      icon: 'fa-duotone fa-solid fa-users',
      routerLink: '/tickets/groups-list',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Mis asignaciones',
      icon: 'fa-duotone fa-solid fa-tasks',
      routerLink: '/tickets/my-assignments',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
        'Seguridad',
        'Limpieza',
        'Jardineria',
      ]),
    },
    {
      label: 'Mis solicitudes',
      icon: 'fa-duotone fa-solid fa-envelope-open-text',
      routerLink: '/tickets/my-requests',
      visible: true,
    },
  ];
}
