import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomBtnComponent from 'src/app/custom-components/custom-buttons/custom-button-button/custom-button.component';
import TicketMessageProgramComponent from '../../messages/ticket-message-program/ticket-message-program.component';

@Component({
    selector: 'app-ticket-program-button',
    imports: [CommonModule, CustomBtnComponent],
    templateUrl: './ticket-program-button.component.html'
})
export default class TicketProgramButtonComponent {
  private dialogHandlerS = inject(DialogHandlerService);

  @Input() item: any;
  @Output() programCompleted = new EventEmitter<void>();

  openProgramDialog() {
    this.dialogHandlerS
      .openDialog(
        TicketMessageProgramComponent,
        { id: this.item.id, ticketGroupId: this.item.ticketGroupId },
        'Programar actividad',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          // Emitir el evento cuando se completa la programación
          this.programCompleted.emit();
        }
      });
  }
}
