import { Component, EventEmitter, Input, Output } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { EBoolTextPipe } from 'src/app/core/pipes/bool-text.pipe';

@Component({
    selector: 'app-orden-compra-status-parcial',
    templateUrl: './orden-compra-status-parcial.component.html',
    imports: [LuxuryAppComponentsModule, EBoolTextPipe]
})
export default class OrdenCompraStatusParcialComponent {
  @Input()
  ordenCompra: any;
  @Input()
  mostrarTabla: boolean;
  @Input()
  ordenCompraPresupuestoUtilizado: boolean;
  @Output()
  modalOrdenCompra: EventEmitter<string> = new EventEmitter();

  onModalOrdenCompraStatus() {
    this.modalOrdenCompra.emit();
  }
}
