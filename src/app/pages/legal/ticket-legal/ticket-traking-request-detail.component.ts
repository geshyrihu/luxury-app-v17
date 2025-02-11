import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-ticket-traking-request-detail',
    templateUrl: './ticket-traking-request-detail.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class TicketTrakingRequestDetailComponent implements OnInit {
  private apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: string = '';
  id = this.config.data.id;

  loading = false;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(`TicketLegal/requestDetail/${this.id}`)
      .then((responseData: any) => {
        this.data = responseData.request;
      });
  }
}
