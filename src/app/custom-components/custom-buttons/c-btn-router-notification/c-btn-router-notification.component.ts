import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'c-btn-router-notification',
  templateUrl: './c-btn-router-notification.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
})
export default class CBtnNotificationComponent {
  router = inject(Router); // Injectamos Router.

  @Input() route: string = ''; // Recibe la ruta como entrada
  @Input() placement: string = 'top'; // Otras propiedades personalizadas
  @Input() ngbTooltip: string = ''; // Otras propiedades personalizadas
  @Input() customNgClass: string = ''; // Estilos adicionales
  @Input() customNgClassBadge: string = 'bg-ligth'; // Estilos adicionales
  @Input() icon: string = ''; // Texto o icono en el botón
  @Input() disabled: boolean = false;
  @Input() labelNotification: string = '';

  onClick(event: Event) {
    event.preventDefault(); // Previene el comportamiento por defecto, si es necesario
    if (this.route) {
      this.router.navigate([this.route]); // Navega a la ruta proporcionada
    }
  }
}
