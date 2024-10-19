import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-dashboard-tickets-resumen',
  templateUrl: './dashboard-tickets-resumen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DashboardTicketsResumenComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  responsibleAreaId: number = 0;

  ngOnInit(): void {
    this.responsibleAreaId = this.config.data.responsibleAreaId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Dashboard/TicketPendientesResumen/${this.customerIdService.customerId}/${this.responsibleAreaId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
