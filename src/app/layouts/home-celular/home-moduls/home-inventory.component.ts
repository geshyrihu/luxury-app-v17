import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-inventory',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-inventory.component.html',
})
export default class HomeInventoryComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Amenidades',
      icon: 'fa-solid fa-spa',
      routerLink: '/inventario/equipos/2',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Equipos',
      icon: 'fa-solid fa-cogs',
      routerLink: '/inventario/equipos/1',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Áreas comunes',
      icon: 'fa-solid fa-tree',
      routerLink: '/inventario/equipos/8',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Cuartos de máquinas',
      icon: 'fa-solid fa-toolbox',
      routerLink: '/inventario/equipos/7',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Mobiliario',
      icon: 'fa-solid fa-chair',
      routerLink: '/inventario/equipos/3',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Llaves',
      icon: 'fa-solid fa-key',
      routerLink: '/inventario/llaves',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Herramientas',
      icon: 'fa-solid fa-wrench',
      routerLink: '/inventario/herramienta',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Radios',
      icon: 'fa-solid fa-broadcast-tower',
      routerLink: '/inventario/radios',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Cómputo y CCTV',
      icon: 'fa-solid fa-desktop',
      routerLink: '/inventario/equipos/6',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Gimnasio',
      icon: 'fa-solid fa-dumbbell',
      routerLink: '/inventario/equipos/5',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Extintores',
      icon: 'fa-solid fa-fire-extinguisher',
      routerLink: '/inventario/extintores',
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
