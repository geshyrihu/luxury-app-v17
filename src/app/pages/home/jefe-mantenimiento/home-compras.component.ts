import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import HomeListGroupComponent, {
  IHomeListGroupComponent,
} from '../home-list-group/home-list-group.component';
@Component({
  selector: 'app-home-compras',
  standalone: true,
  imports: [HomeListGroupComponent],
  templateUrl: './home-compras.component.html',
})
export default class HomeComprasComponent {
  authS = inject(AuthService);
  data: IHomeListGroupComponent[] = [
    {
      name: 'Productos y Servicios',
      icon: 'fa-solid fa-cogs', // Representa productos y servicios, como engranajes o herramientas.
      routerLink: '/catalog/products-services',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Solicitud de compra',
      icon: 'fa-solid fa-file-invoice', // Representa solicitudes o facturas (una opción más apropiada para compras).
      routerLink: '/operaciones/compras/solicitudes-compra',
      isAutorized: this.authS.onValidateRoles([
        'SuperUsuario',
        'SupervisionOperativa',
        'Administrador',
        'Asistente',
        'JefeMantenimiento',
      ]),
    },
    {
      name: 'Ordenes de compra',
      icon: 'fa-solid fa-shopping-cart', // Ícono adecuado para ordenes de compra (carrito de compras).
      routerLink: '/operaciones/compras/ordenes-compra',
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
