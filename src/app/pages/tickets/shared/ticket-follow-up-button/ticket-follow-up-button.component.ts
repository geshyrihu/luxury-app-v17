import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketMessageFollowupComponent from '../../../tickets/folloups/ticket-message-followup/ticket-message-followup.component';

@Component({
  selector: 'app-ticket-follow-up-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-follow-up-button.component.html',
})
export default class TicketFollowUpButtonComponent {
  private dialogHandlerS = inject(DialogHandlerService);

  @Input() id!: string; // ID para el seguimiento
  @Input() followUpCount!: number; // Cantidad de seguimientos (opcional, para mostrar en el botón)
  @Output() followUpCompleted = new EventEmitter<void>(); // EventEmitter para notificar al padre

  onFollowUp() {
    this.dialogHandlerS
      .openDialog(
        TicketMessageFollowupComponent,
        { id: this.id },
        'Seguimiento',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.followUpCompleted.emit(); // Emitir el evento si el seguimiento se completó
        }
      });
  }
}
