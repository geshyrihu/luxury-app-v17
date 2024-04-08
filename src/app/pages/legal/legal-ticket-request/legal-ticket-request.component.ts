import { Component, inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CustomToastService } from 'src/app/core/services/common-services';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import LegalTicketAddComponent from '../../proyect-ticket/legal-ticket-add/legal-ticket-add.component';

@Component({
  selector: 'app-legal-ticket-request',
  templateUrl: './legal-ticket-request.component.html',
  standalone: true,

  providers: [CustomToastService],
})
export class LegalTicketRequestComponent {
  customToastService = inject(CustomToastService);
  dialogService = inject(DialogService);
  dialogHandlerService = inject(DialogHandlerService);

  onModalTicketLegal() {
    this.dialogHandlerService.openDialog(
      LegalTicketAddComponent,
      null,
      'TICKET LEGAL',
      this.dialogHandlerService.dialogSizeLg // Tamaño del cuadro de diálogo
    );
  }
}
