import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'c-btn-router-event',
  templateUrl: './c-btn-router-event.component.html',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
})
export class CBtnRouterEventComponent {
  @Input() route: string = ''; // Recibe la ruta como entrada
  @Input() placement: string = 'top'; // Otras propiedades personalizadas
  @Input() ngbTooltip: string = ''; // Otras propiedades personalizadas
  @Input() customNgClass: string = ''; // Estilos adicionales
  @Input() customNgClassBadge: string = 'bg-ligth'; // Estilos adicionales
  @Input() icon: string = ''; // Texto o icono en el botón
  @Input() disabled: boolean = false;
  @Input() labelNotification: string = '';

  @Output() event = new EventEmitter<any>();
  onClick(value: any) {
    this.event.emit(value);
  }
}
