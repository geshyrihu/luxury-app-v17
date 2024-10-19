import { Component, EventEmitter, Input, Output } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
@Component({
  selector: 'app-orden-compra-datos-cotizacion',
  templateUrl: './orden-compra-datos-cotizacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenCompraDatosCotizacionComponent {
  @Input()
  ordenCompra: any;
  @Input()
  bloqueada: boolean;
  @Input()
  solicitudCompraId: number = 0;
  @Output()
  modalOrdenCompra: EventEmitter<string> = new EventEmitter();

  onModalOrdenCompra() {
    this.modalOrdenCompra.emit();
  }
}
