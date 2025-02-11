import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
    selector: 'app-home-bitacoras',
    imports: [HomeListGroupComponent],
    templateUrl: './home-bitacoras.component.html'
})
export default class HomeBitacorasComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Lecturas consumos',
      icon: 'fa-duotone  fa-droplet',
      routerLink: '/logbook/lista-medidor',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
    {
      label: 'Albercas',
      icon: 'fa-duotone  fa-water-ladder',
      routerLink: '/logbook/piscina',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
    {
      label: 'Fallas elevadores',
      icon: 'fa-duotone  fa-elevator',
      routerLink: '/tickets/my-requests',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Refacciones elevadores',
      icon: 'fa-duotone  fa-puzzle-piece',
      routerLink: '/logbook/elevator-spare-parts-change',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-engine',
      label: 'Mantenimiento equipos',
      routerLink: '/logbook/ordenes-mantenimiento',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-engine',
      label: 'Recorrido diario',
      routerLink: '/logbook/recorrido',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
  ];
}
