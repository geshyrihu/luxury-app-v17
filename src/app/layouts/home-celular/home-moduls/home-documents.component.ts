import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';

@Component({
  selector: 'app-home-documents',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-documents.component.html',
})
export default class HomeDocumentsComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Documentos del edificio',
      icon: 'fa-solid fa-folder-open', // Representa un lugar donde se almacenan documentos.
      routerLink: '/documento/documento',
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
      label: 'Informe edos financieros',
      icon: 'fa-solid fa-file-invoice-dollar',
      routerLink: '/documento/documento',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Polizas de Mantenimiento',
      icon: 'fa-solid fa-file-contract', // Simboliza contratos o pólizas.
      routerLink: '/documento/poliza',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'Condomino',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
      ]),
    },
    {
      label: 'Formatos',
      icon: 'fa-solid fa-file-lines', // Representa documentos o plantillas de texto.
      routerLink: '/documento/formatos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Manuales y procesos',
      icon: 'fa-solid fa-book-open', // Representa un libro abierto, ideal para manuales.
      routerLink: '/documento/procesos',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Catalogo de pintura',
      icon: 'fa-solid fa-palette', // Representa una paleta de colores.
      routerLink: '/catalog/pintura',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Catalogo de iluminacion',
      icon: 'fa-solid fa-lightbulb', // Simboliza iluminación.
      routerLink: '/catalog/iluminacion',
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
