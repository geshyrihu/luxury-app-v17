import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';
@Component({
  selector: 'custom-button-delete-span',
  templateUrl: './custom-button-delete-span.component.html',
  standalone: true,
  imports: [ToastModule, NgbTooltip],
})
export default class CustomButtonDeleteSpanComponent {
  @Input()
  nameItem: string = '';
  @Input()
  textpTooltip: string = 'Eliminar';
  @Input()
  textHeader: string = 'Confirmar borrado!';

  @Output()
  OnConfirm = new EventEmitter<any>();

  confirm(event: EventEmitter<any>): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'Se va a elimnar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        return this.OnConfirm.emit(event);
      }
    });
  }
}
