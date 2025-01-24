import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-documents',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-documents.component.html',
})
export default class HomeDocumentsComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Documentos del edificio',
      icon: 'fa-solid fa-folder-open', // Representa un lugar donde se almacenan documentos.
      routerLink: '/documento/documento',
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
      name: 'Informe edos financieros',
      icon: 'fa-solid fa-file-invoice-dollar',
      routerLink: '/documento/documento',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Polizas de Mantenimiento',
      icon: 'fa-solid fa-file-contract', // Simboliza contratos o pólizas.
      routerLink: '/documento/poliza',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      name: 'Formatos',
      icon: 'fa-solid fa-file-lines', // Representa documentos o plantillas de texto.
      routerLink: '/documento/formatos',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Manuales y procesos',
      icon: 'fa-solid fa-book-open', // Representa un libro abierto, ideal para manuales.
      routerLink: '/documento/procesos',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Catalogo de pintura',
      icon: 'fa-solid fa-palette', // Representa una paleta de colores.
      routerLink: '/catalog/pintura',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Catalogo de iluminacion',
      icon: 'fa-solid fa-lightbulb', // Simboliza iluminación.
      routerLink: '/catalog/iluminacion',
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
