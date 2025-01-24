import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-juntas-comite',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-juntas-comite.component.html',
})
export default class HomeJuntasComiteComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Presentaciones',
      icon: 'fa-solid fa-chalkboard-user',
      routerLink: '/junta-comite/presentaciones',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Minutas',
      icon: 'fa-solid fa-file-lines',
      routerLink: '//junta-comite/minutas',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
  ];
}
