import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'custom-button-delete',
  templateUrl: './custom-button-delete.component.html',
  standalone: true,
  imports: [NgbTooltip],
})
export default class CustomButtonDeleteComponent {
  @Input()
  textpTooltip: string = 'Eliminar';
  @Input()
  placement: string = 'top';
  @Input()
  textHeader: string = 'Confirmar borrado!';

  @Output()
  OnConfirm = new EventEmitter<any>();

  confirm(event: EventEmitter<any>): void {
    Swal.fire({
      title: '¿Confirmar?',
      text: 'Se va a eliminar el registro',
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
