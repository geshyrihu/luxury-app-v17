import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
    selector: 'app-summary-ticket-committee-meeting',
    templateUrl: './summary-ticket-committee-meeting.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class SummaryTicketCommitteeMeetingComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);

  customerIdS = inject(CustomerIdService);
  config = inject(DynamicDialogConfig);

  data: any[] = [];
  ref: DynamicDialogRef;

  eAreaMinutasDetalles: any;

  ngOnInit(): void {
    this.eAreaMinutasDetalles = this.config.data.eAreaMinutasDetalles;
    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `Dashboard/MinutasPendientesResumen/${this.customerIdS.getCustomerId()}/${
      this.eAreaMinutasDetalles
    }`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
