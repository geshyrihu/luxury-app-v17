import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import TicketMessageFollowupComponent from '../../folloups/ticket-message-followup/ticket-message-followup.component';

@Component({
  selector: 'app-ticket-follow-up-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-follow-up-button.component.html',
})
export default class TicketFollowUpButtonComponent {
  @Input() id!: string; // ID para el seguimiento
  @Input() followUpCount!: number; // Cantidad de seguimientos (opcional, para mostrar en el botón)
  @Output() followUpCompleted = new EventEmitter<void>(); // EventEmitter para notificar al padre

  constructor(private dialogHandlerService: DialogHandlerService) {}

  onFollowUp() {
    this.dialogHandlerService
      .openDialog(
        TicketMessageFollowupComponent,
        { id: this.id },
        'Seguimiento',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.followUpCompleted.emit(); // Emitir el evento si el seguimiento se completó
        }
      });
  }
}
