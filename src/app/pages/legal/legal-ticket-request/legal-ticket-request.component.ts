import { Component, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomToastService } from 'src/app/core/services/common-services';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import LegalTicketAddOrEditComponent from '../../proyect-ticket/legal-ticket-add-or-edit/legal-ticket-add-or-edit.component';

@Component({
  selector: 'app-legal-ticket-request',
  templateUrl: './legal-ticket-request.component.html',
  standalone: true,

  providers: [CustomToastService],
})
export class LegalTicketRequestComponent {
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public dialogHandlerService = inject(DialogHandlerService);

  onModalTicketLegal() {
    this.dialogHandlerService.openDialog(
      LegalTicketAddOrEditComponent,
      null,
      'TICKET LEGAL',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
}
