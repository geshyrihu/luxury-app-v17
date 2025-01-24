import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-tickets',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-tickets.component.html',
})
export default class HomeTicketsComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Grupos de trabajo',
      icon: 'fa-duotone fa-solid fa-users',
      routerLink: '/tickets/list',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Mis asignaciones',
      icon: 'fa-duotone fa-solid fa-tasks',
      routerLink: '/tickets/my-assignments',
      isAutorized: this.authS.onValidateRoles([
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
      name: 'Mis solicitudes',
      icon: 'fa-duotone fa-solid fa-envelope-open-text',
      routerLink: '/tickets/my-requests',
      isAutorized: true,
    },
  ];
}
