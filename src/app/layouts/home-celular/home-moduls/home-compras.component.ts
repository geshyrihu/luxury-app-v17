import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { IMenuItem } from '../../sidebar/menu.model';
import HomeListGroupComponent from '../home-list-group/home-list-group.component';
@Component({
    selector: 'app-home-compras',
    imports: [HomeListGroupComponent],
    templateUrl: './home-compras.component.html'
})
export default class HomeComprasComponent {
  authS = inject(AuthService);
  data: IMenuItem[] = [
    {
      label: 'Productos y Servicios',
      icon: 'fa-solid fa-cogs', // Representa productos y servicios, como engranajes o herramientas.
      routerLink: '/catalog/products-services',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Solicitud de compra',
      icon: 'fa-solid fa-file-invoice', // Representa solicitudes o facturas (una opción más apropiada para compras).
      routerLink: '//compras/solicitudes-compra',
      visible: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      label: 'Ordenes de compra',
      icon: 'fa-solid fa-shopping-cart', // Ícono adecuado para ordenes de compra (carrito de compras).
      routerLink: '//compras/ordenes-compra',
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
