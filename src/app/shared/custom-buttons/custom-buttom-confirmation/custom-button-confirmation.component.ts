import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'custom-button-confirmation',
  templateUrl: './custom-button-confirmation.component.html',
  standalone: true,
  imports: [NgIf, NgbTooltip],
})
export default class CustomButtonConfirmationComponent {
  @Input()
  tooltipText: string = 'Enviar Email';
  @Input()
  mostrar: boolean = true;
  @Input()
  text: string = 'Se enviara correo electronico!';
  @Input()
  title: string = '¿Estas seguro?';
  @Input()
  icon: string = 'fa-duotone fa-paper-plane';
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
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: this.confirmButtonText,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        return this.OnConfirm.emit(event);
      }
    });
  }
}
