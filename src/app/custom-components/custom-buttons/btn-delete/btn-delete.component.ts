import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import BtnComponent from '../a-master-btn-button/a-master-btn.component';

@Component({
  selector: 'btn-delete',
  templateUrl: './btn-delete.component.html',
  standalone: true,
  imports: [NgbTooltip, BtnComponent],
})
export default class BtnDeleteComponent {
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
      confirmButtonColor: '#50C878',
      cancelButtonColor: '#9B1B30',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        return this.OnConfirm.emit(event);
      }
    });
  }
}
