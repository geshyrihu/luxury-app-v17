import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-directorios',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-directorios.component.html',
})
export default class HomeDirectoriosComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Condominos',
      icon: 'fa-solid fa-building', // Representa edificios o viviendas
      routerLink: '/directory/condominos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Comité de Vigilancia',
      icon: 'fa-solid fa-shield-alt', // Representa seguridad o vigilancia
      routerLink: '/directory/comite-vigilancia',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Personal Interno',
      icon: 'fa-solid fa-users', // Representa un grupo de personas
      routerLink: '/directory/personal-interno',
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
      label: 'Personal Externo',
      icon: 'fa-solid fa-user-tie', // Representa personas externas o profesionales
      routerLink: '/directory/personal-externo',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Catalogo de Proveedores',
      icon: 'fa-solid fa-box-open', // Representa inventario o proveedores
      routerLink: '/directory/proveedor',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Telefonos de Emergencia',
      icon: 'fa-solid fa-phone-alt', // Representa teléfonos o comunicación
      routerLink: '/directory/telefonos-emergencia',
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
