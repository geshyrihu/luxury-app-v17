import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import TicketDateRangeSelectorComponent from 'src/app/pages/5.3-tickets/shared/ticket-date-range-selector/ticket-date-range-selector.component';

@Component({
  selector: 'app-legal-reports-external',
  standalone: true,
  templateUrl: './legal-reports-external.component.html',
  imports: [LuxuryAppComponentsModule, TicketDateRangeSelectorComponent],
  providers: [DatePipe], // Provide DatePipe in the component
})
export default class LegalReportsExternalComponent {
  apiRequestService = inject(ApiRequestService);
  datePipe = inject(DatePipe);
  // Declaración e inicialización de variables
  reportData: any;
  requestsAttended: any;
  requestsPending: any;

  startDate: string = '';
  endDate: string = '';
  async ngOnInit(): Promise<void> {
    // Calculate the start date as the first day of the previous month
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setDate(1);

    // Calculate the end date as the last day of the previous month
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth());
    endDate.setDate(0);

    // Format the dates
    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(endDate);
    // Format dates as strings (YYYY-MM-DD)
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Call onLoadData with the formatted dates
    await Promise.all([
      this.onLoadReport(formattedStartDate, formattedEndDate),
      this.onRequestsAttended(formattedStartDate, formattedEndDate),
      this.onRequestsPending(),
    ]);
  }

  onLoadReport(startDate: string, endDate: string) {
    const urlApi = `LegalReport/Results/${startDate}/${endDate}/${false}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.reportData = result;
    });
  }
  onRequestsAttended(startDate: string, endDate: string) {
    const urlApi = `LegalReport/RequestsAttended/${startDate}/${endDate}/${false}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.requestsAttended = result;
    });
  }
  onRequestsPending() {
    const urlApi = `LegalReport/RequestsPending/${false}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.requestsPending = result;
    });
  }

  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    // Format the dates
    this.startDate = this.formatDate(event.startDate);
    this.endDate = this.formatDate(event.endDate);

    this.onLoadReport(startDateFormatted, endDateFormatted);
    this.onRequestsAttended(startDateFormatted, endDateFormatted);
    this.onRequestsPending();
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MMM-yyyy') || ''; // Formatea la fecha
  }
}
