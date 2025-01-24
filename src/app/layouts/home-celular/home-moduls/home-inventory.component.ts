import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-inventory',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-inventory.component.html',
})
export default class HomeInventoryComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Amenidades',
      icon: 'fa-solid fa-spa',
      routerLink: '/inventario/equipos/2',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Equipos',
      icon: 'fa-solid fa-cogs',
      routerLink: '/inventario/equipos/1',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Áreas comunes',
      icon: 'fa-solid fa-tree',
      routerLink: '/inventario/equipos/8',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Cuartos de máquinas',
      icon: 'fa-solid fa-toolbox',
      routerLink: '/inventario/equipos/7',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Mobiliario',
      icon: 'fa-solid fa-chair',
      routerLink: '/inventario/equipos/3',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Llaves',
      icon: 'fa-solid fa-key',
      routerLink: '/inventario/llaves',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Herramientas',
      icon: 'fa-solid fa-wrench',
      routerLink: '/inventario/herramienta',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Radios',
      icon: 'fa-solid fa-broadcast-tower',
      routerLink: '/inventario/radios',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Cómputo y CCTV',
      icon: 'fa-solid fa-desktop',
      routerLink: '/inventario/equipos/6',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Gimnasio',
      icon: 'fa-solid fa-dumbbell',
      routerLink: '/inventario/equipos/5',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Extintores',
      icon: 'fa-solid fa-fire-extinguisher',
      routerLink: '/inventario/extintores',
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
