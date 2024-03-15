import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-ticket-traking-customer',
  templateUrl: './ticket-traking-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export class TicketTrakingCustomerComponent implements OnInit {
  public config = inject(DynamicDialogConfig);
  public apiRequestService = inject(ApiRequestService);

  seguimientos: any[] = [];
  submitting: boolean = false;

  loading = false;
  ticketId: string = this.config.data.ticketId;
  id: string = '';

  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  onCargaListaseguimientos() {
    this.apiRequestService
      .onGetItem(`TicketLegal/Traking/${this.ticketId}`)
      .then((result: any) => {
        this.seguimientos = result;
      });
  }
}
