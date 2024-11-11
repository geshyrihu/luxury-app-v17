import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-summary-tickets',
  templateUrl: './summary-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SummaryTicketsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  groupId: number = 0;

  ngOnInit(): void {
    this.groupId = this.config.data.groupId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Dashboard/TicketPendientesResumen/${this.groupId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
