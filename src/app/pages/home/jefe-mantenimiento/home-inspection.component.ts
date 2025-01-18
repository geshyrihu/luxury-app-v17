import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-inspection',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-inspection.component.html',
})
export default class HomeInspectionComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Administrar inspecciones',
      icon: 'fa-solid fa-tasks', // Ícono para tareas (también podrías usar fa-tools)
      routerLink: '/inspections/catalog',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Ejecutar inspecciones',
      icon: 'fa-solid fa-clipboard-check', // Ícono para verificación de inspección
      routerLink: '/inspections/my-inspection-list',
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
  ];
}
