import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { LegalTicketRequestComponent } from '../legal-ticket-request/legal-ticket-request.component';

@Component({
  selector: 'app-legal-list-ticket',
  templateUrl: './legal-list-ticket.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalListTicketComponent implements OnInit {
  public dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {}

  onModalRequest(data: any) {
    this.dialogHandlerService
      .openDialog(
        LegalTicketRequestComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
