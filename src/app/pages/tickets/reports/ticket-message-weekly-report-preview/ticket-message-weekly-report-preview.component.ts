import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TicketGroupService } from 'src/app/pages/tickets/ticket.service';
import { DateRangeStorageService } from '../../services/date-range-storage.service';

@Component({
  selector: 'app-ticket-message-weekly-report-preview',
  templateUrl: './ticket-message-weekly-report-preview.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class TicketMessageWeeklyReportPreviewComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  dateRangeStorageService = inject(DateRangeStorageService);
  ticketGroupService = inject(TicketGroupService);

  // Declaración e inicialización de variables
  data: any;
  // Modificamos la declaración de dateRange para que use un objeto con from y to
  year: any = this.ticketGroupService.year || 0;
  numeroSemana: any = this.ticketGroupService.numeroSemana || 0;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `TicketReport/WeeklyReportPreview/${this.custIdService.customerId}/${this.year}/${this.numeroSemana}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
