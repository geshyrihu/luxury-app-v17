import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import TicketDateRangeSelectorComponent from '../../shared/ticket-date-range-selector/ticket-date-range-selector.component';
import { TicketMessageStatusComponent } from '../../shared/ticket-message-status/ticket-message-status.component';
import { TicketGroupService } from '../../ticket.service';

@Component({
  selector: 'app-ticket-message-report-work-plan',
  templateUrl: './ticket-message-report-work-plan.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    TicketMessageStatusComponent,
    TicketDateRangeSelectorComponent,
  ],
})
export default class TicketMessageReportWorkPlanComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  ticketGroupService = inject(TicketGroupService);
  customerIdService = inject(CustomerIdService);

  data: any;
  status: number = this.ticketGroupService.ticketGroupMessageStatus;

  ngOnInit() {}

  onLoadData(startDate: string, endDate: string) {
    const urlApi = `TicketReport/GetTicketReport/${this.customerIdService.customerId}/${startDate}/${endDate}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    console.log('Fechas seleccionadas:', event.startDate, event.endDate);

    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    // Aquí puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData(startDateFormatted, endDateFormatted);
  }
}
