import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
    selector: 'app-home-inspection',
    imports: [HomeListGroupComponent],
    templateUrl: './home-inspection.component.html'
})
export default class HomeInspectionComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Administrar inspecciones',
      icon: 'fa-solid fa-tasks', // Ícono para tareas (también podrías usar fa-tools)
      routerLink: '/inspections/catalog',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Ejecutar inspecciones',
      icon: 'fa-solid fa-clipboard-check', // Ícono para verificación de inspección
      routerLink: '/inspections/my-inspection-list',
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
  ];
}
