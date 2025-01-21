import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomBtnComponent from 'src/app/custom-components/custom-buttons/custom-button-button/custom-button.component';
import TicketMessageProgramComponent from '../../messages/ticket-message-program/ticket-message-program.component';

@Component({
  selector: 'app-ticket-program-button',
  standalone: true,
  imports: [CommonModule, CustomBtnComponent],
  templateUrl: './ticket-program-button.component.html',
})
export default class TicketProgramButtonComponent {
  @Input() item: any;
  @Output() programCompleted = new EventEmitter<void>();

  constructor(private dialogHandlerService: DialogHandlerService) {}

  openProgramDialog() {
    this.dialogHandlerService
      .openDialog(
        TicketMessageProgramComponent,
        { id: this.item.id, ticketGroupId: this.item.ticketGroupId },
        'Programar actividad',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          // Emitir el evento cuando se completa la programación
          this.programCompleted.emit();
        }
      });
  }
}
