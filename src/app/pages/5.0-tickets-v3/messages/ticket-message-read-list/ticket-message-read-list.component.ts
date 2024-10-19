import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-ticket-message-read-list',
  templateUrl: './ticket-message-read-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketMessageReadListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  loading = false;
  ticketMessageId: number = this.config.data.id;
  data: any[] = [];
  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    this.loading = true;

    const urlApi = `TicketMessageRead/List/${this.ticketMessageId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.loading = false;
    });
  }
}
