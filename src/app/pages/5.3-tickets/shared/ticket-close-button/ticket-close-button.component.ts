import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import BtnComponent from 'src/app/custom-components/custom-buttons/a-master-btn-button/a-master-btn.component';
import TicketMessageCloseComponent from '../../messages/ticket-message-close/ticket-message-close.component';

@Component({
  selector: 'app-ticket-close-button',
  standalone: true,
  imports: [BtnComponent],
  templateUrl: './ticket-close-button.component.html',
})
export default class TicketCloseButtonComponent {
  dialogHandlerService = inject(DialogHandlerService);

  @Input() item: any;
  @Output() closedCompleted = new EventEmitter<void>();

  openCloseDialog() {
    this.dialogHandlerService
      .openDialog(
        TicketMessageCloseComponent,
        { id: this.item.id },
        'Cerrar ticket',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.closedCompleted.emit();
        }
      });
  }
}
