import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EBoolTextPipe } from 'src/app/core/pipes/bool-text.pipe';

@Component({
  selector: 'app-orden-compra-status-parcial',
  templateUrl: './orden-compra-status-parcial.component.html',
  standalone: true,
  imports: [CommonModule, EBoolTextPipe],
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
