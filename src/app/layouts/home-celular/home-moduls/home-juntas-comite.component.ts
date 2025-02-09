import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-juntas-comite',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-juntas-comite.component.html',
})
export default class HomeJuntasComiteComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Presentaciones',
      icon: 'fa-solid fa-chalkboard-user',
      routerLink: '/junta-comite/presentaciones',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Minutas',
      icon: 'fa-solid fa-file-lines',
      routerLink: '//junta-comite/minutas',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
