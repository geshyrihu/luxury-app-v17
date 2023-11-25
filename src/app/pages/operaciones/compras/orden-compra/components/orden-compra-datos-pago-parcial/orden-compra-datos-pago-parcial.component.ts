import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-orden-compra-datos-pago-parcial',
  templateUrl: './orden-compra-datos-pago-parcial.component.html',
  standalone: true,
  imports: [],
})
export default class OrdenCompraDatosPagoParcialComponent implements OnInit {
  @Input()
  ordenCompra: any;
  @Input()
  bloqueada: boolean;
  @Output()
  modalOrdenCompra: EventEmitter<string> = new EventEmitter();

  onModalOrdenCompraDatosPago() {
    this.modalOrdenCompra.emit();
  }

  ngOnInit(): void {}
}
