import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomBtnComponent from 'src/app/custom-components/custom-buttons/custom-button-button/custom-button.component';
import TicketMessageReopenComponent from '../../messages/ticket-message-reopen/ticket-message-reopen.component';

@Component({
  selector: 'app-ticket-reopen-button',
  standalone: true,
  imports: [CommonModule, CustomBtnComponent],
  templateUrl: './ticket-reopen-button.component.html',
})
export default class TicketReopenButtonComponent {
  private dialogHandlerService = inject(DialogHandlerService);

  @Input() item: any;
  @Output() reopenCompleted = new EventEmitter<void>();

  openReopenDialog() {
    this.dialogHandlerService
      .openDialog(
        TicketMessageReopenComponent,
        { id: this.item.id },
        'Re abrir ticket',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.reopenCompleted.emit(); // Emitir el evento cuando se complete la reapertura
        }
      });
  }
}
