import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomBtnComponent from 'src/app/custom-components/custom-buttons/custom-button-button/custom-button.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-progress-button',
  standalone: true,
  imports: [CommonModule, CustomBtnComponent],
  templateUrl: './ticket-progress-button.component.html',
})
export default class TicketProgressButtonComponent {
  private apiRequestService = inject(ApiRequestService);
  private authS = inject(AuthService);

  @Input() item: any;
  @Output() progressCompleted = new EventEmitter<void>();

  openProgressDialog() {
    Swal.fire({
      title: 'Confirmar',
      text: 'Se colocará el ticket en proceso',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#50C878',
      cancelButtonColor: '#9B1B30',
      confirmButtonText: 'Sí, en proceso!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const urlApi = `Tickets/InProgress/${this.item.id}/${this.authS.applicationUserId}`;

        this.apiRequestService.onGetItem(urlApi).then(() => {
          this.progressCompleted.emit(); // Emitir el evento de finalización
        });
      }
    });
  }
}
