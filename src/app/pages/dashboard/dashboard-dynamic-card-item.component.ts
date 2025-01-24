import { Component, EventEmitter, Input, Output } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';

@Component({
  selector: 'app-dashboard-dynamic-card-item',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './dashboard-dynamic-card-item.component.html',
})
export default class DashboardDynamicCardItemComponent {
  // Propiedades de entrada para el componente
  @Input() header: string = ''; // Título de la sección
  @Input() data: any[] = []; // Datos para los tickets
  @Input() columnClass: string = 'col-md-6'; // Clases de columna dinámicas

  // Evento de salida para emitir cuando se hace clic en la tarjeta
  @Output() cardClick = new EventEmitter<any>();

  // Método que se invoca cuando se hace clic en la tarjeta
  onCardClick(ticket: any) {
    this.cardClick.emit(ticket); // Emitir el ticket al componente padre
  }
}
