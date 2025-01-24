import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-directorios',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-directorios.component.html',
})
export default class HomeDirectoriosComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Condominos',
      icon: 'fa-solid fa-building', // Representa edificios o viviendas
      routerLink: '/directory/condominos',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Comité de Vigilancia',
      icon: 'fa-solid fa-shield-alt', // Representa seguridad o vigilancia
      routerLink: '/directory/comite-vigilancia',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Personal Interno',
      icon: 'fa-solid fa-users', // Representa un grupo de personas
      routerLink: '/directory/personal-interno',
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
      name: 'Personal Externo',
      icon: 'fa-solid fa-user-tie', // Representa personas externas o profesionales
      routerLink: '/directory/personal-externo',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Catalogo de Proveedores',
      icon: 'fa-solid fa-box-open', // Representa inventario o proveedores
      routerLink: '/directory/proveedor',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Telefonos de Emergencia',
      icon: 'fa-solid fa-phone-alt', // Representa teléfonos o comunicación
      routerLink: '/directory/telefonos-emergencia',
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
