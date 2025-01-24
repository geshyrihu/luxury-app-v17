import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-bitacoras',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-bitacoras.component.html',
})
export default class HomeBitacorasComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Lecturas consumos',
      icon: 'fa-duotone  fa-droplet',
      routerLink: '/logbook/lista-medidor',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
    {
      name: 'Albercas',
      icon: 'fa-duotone  fa-water-ladder',
      routerLink: '/logbook/piscina',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
    {
      name: 'Fallas elevadores',
      icon: 'fa-duotone  fa-elevator',
      routerLink: '/tickets/my-requests',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Refacciones elevadores',
      icon: 'fa-duotone  fa-puzzle-piece',
      routerLink: '/logbook/elevator-spare-parts-change',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-engine',
      name: 'Mantenimiento equipos',
      routerLink: '/operaciones/mantenimiento-preventivo',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      icon: 'fa-duotone fa-engine',
      name: 'Recorrido diario',
      routerLink: '/logbook/recorrido',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'JefeMantenimiento',
        'AuxiliarMantenimiento',
      ]),
    },
  ];
}
