import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomBtnComponent from 'src/app/custom-components/custom-buttons/custom-button-button/custom-button.component';
import TicketMessageCloseComponent from '../../messages/ticket-message-close/ticket-message-close.component';

@Component({
  selector: 'app-ticket-close-button',
  standalone: true,
  imports: [CustomBtnComponent],
  templateUrl: './ticket-close-button.component.html',
})
export default class TicketCloseButtonComponent {
  dialogHandlerS = inject(DialogHandlerService);

  @Input() item: any;
  @Output() closedCompleted = new EventEmitter<void>();

  openCloseDialog() {
    this.dialogHandlerS
      .openDialog(
        TicketMessageCloseComponent,
        { id: this.item.id },
        'Cerrar ticket',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.closedCompleted.emit();
        }
      });
  }
}
