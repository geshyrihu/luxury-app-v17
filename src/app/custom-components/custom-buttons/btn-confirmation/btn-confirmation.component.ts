import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'btn-confirmation',
  templateUrl: './btn-confirmation.component.html',
  standalone: true,
  imports: [NgbTooltip],
})
export default class BtnConfirmationComponent {
  @Input()
  tooltipText: string = 'Enviar Email';
  @Input()
  mostrar: boolean = true;
  @Input()
  text: string = 'Se enviara correo electronico!';
  @Input()
  title: string = '¿Estas seguro?';
  @Input()
  icon: string = 'fa-solid fa-paper-plane';
  @Input()
  label: string = '';
  @Input()
  placementPosition: string = 'left';
  @Input()
  classButton: string = '';
  @Input()
  confirmButtonText: string = 'Sí, enviar!';
  @Input()
  iconSwal: SweetAlertIcon = 'warning';
  @Input()
  disabled: boolean = false;
  @Output()
  OnConfirm = new EventEmitter<any>();

  /**
   * Confirm sweet alert
   * @param confirm modal content
   */
  confirm(event: EventEmitter<any>) {
    Swal.fire({
      title: this.title,
      text: this.text,
      icon: this.iconSwal,
      showCancelButton: true,
      confirmButtonColor: '#50C878',
      cancelButtonColor: '#9B1B30',
      confirmButtonText: this.confirmButtonText,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        return this.OnConfirm.emit(event);
      }
    });
  }
}
