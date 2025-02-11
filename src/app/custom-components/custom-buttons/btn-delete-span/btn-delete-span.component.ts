import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'primeng/toast';
import Swal from 'sweetalert2';

@Component({
    imports: [ToastModule, NgbTooltip],
    selector: 'btn-delete-span',
    templateUrl: './btn-delete-span.component.html'
})
export default class BtnDeleteSpanComponent {
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
      confirmButtonColor: '#50C878',
      cancelButtonColor: '#9B1B30',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((responseData) => {
      if (responseData.value) {
        return this.OnConfirm.emit(event);
      }
    });
  }
}
