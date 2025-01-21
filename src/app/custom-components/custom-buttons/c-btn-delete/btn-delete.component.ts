import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import CustomBtnComponent from '../custom-button-button/custom-button.component';

@Component({
  imports: [NgbTooltip, CustomBtnComponent],
  selector: 'c-btn-delete',
  standalone: true,
  templateUrl: './c-btn-delete.component.html',
})
export default class BtnDeleteComponent {
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
