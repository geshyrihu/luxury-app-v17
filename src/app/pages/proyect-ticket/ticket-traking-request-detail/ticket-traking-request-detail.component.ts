import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-ticket-traking-request-detail',
  templateUrl: './ticket-traking-request-detail.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketTrakingRequestDetailComponent implements OnInit {
  private apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: string = '';
  id = this.config.data.id;

  loading = false;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(`TicketLegal/requestDetail/${this.id}`)
      .then((result: any) => {
        this.data = result.request;
      });
  }
}
