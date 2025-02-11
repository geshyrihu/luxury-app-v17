import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import TicketDateRangeSelectorComponent from 'src/app/pages/tickets/shared/ticket-date-range-selector/ticket-date-range-selector.component';

@Component({
  selector: 'app-legal-reports-internal',
  templateUrl: './legal-reports-internal.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketDateRangeSelectorComponent],
  providers: [DatePipe], // Provide DatePipe in the component
})
export default class LegalReportsInternalComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  datePipe = inject(DatePipe);
  // Declaración e inicialización de variables
  data: any;
  reportData: any;
  requestsAttended: any;
  requestsPending: any;
  summaryIndividual: any;
  summaryCustomer: any;
  totalRequests: {
    TotalTickets: number;
    CompletedTickets: number;
    PendingTickets: number;
  } | null = null;

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
      this.onLoadData(formattedStartDate, formattedEndDate),
      this.onLoadSummaryCustomer(formattedStartDate, formattedEndDate),
      this.onLoadDataSummaryIndividual(formattedStartDate, formattedEndDate),
      this.onLoadDataTotalRequests(formattedStartDate, formattedEndDate),
    ]);
  }

  onLoadReport(startDate: string, endDate: string) {
    const urlApi = `LegalReport/Results/${startDate}/${endDate}/${true}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.reportData = responseData;
    });
  }
  onRequestsAttended(startDate: string, endDate: string) {
    const urlApi = `LegalReport/RequestsAttended/${startDate}/${endDate}/${true}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.requestsAttended = responseData;
    });
  }
  onRequestsPending() {
    const urlApi = `LegalReport/RequestsPending/${true}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.requestsPending = responseData;
    });
  }

  onLoadData(startDate: string, endDate: string) {
    const urlApi = `LegalReport/Summary/${startDate}/${endDate}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onLoadSummaryCustomer(startDate: string, endDate: string) {
    const urlApi = `LegalReport/SummaryCustomer/${startDate}/${endDate}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.summaryCustomer = responseData;
    });
  }

  onLoadDataSummaryIndividual(startDate: string, endDate: string) {
    const urlApi = `LegalReport/SummaryIndividual/${startDate}/${endDate}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.summaryIndividual = responseData;
    });
  }
  onLoadDataTotalRequests(startDate: string, endDate: string) {
    const urlApi = `LegalReport/TotalRequests/${startDate}/${endDate}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.totalRequests = responseData;
    });
  }
  onDateRangeSelected(event: { startDate: Date; endDate: Date }) {
    // Convierte las fechas a formato ISO
    const startDateFormatted = event.startDate.toISOString(); // Formato: '2024-09-30T00:00:00.000Z'
    const endDateFormatted = event.endDate.toISOString(); // Formato: '2024-10-17T00:00:00.000Z'

    // Format the dates
    this.startDate = this.formatDate(event.startDate);
    this.endDate = this.formatDate(event.endDate);
    // Aquí puedes usar las fechas seleccionadas para obtener el reporte de tickets
    this.onLoadData(startDateFormatted, endDateFormatted);
    this.onLoadDataTotalRequests(startDateFormatted, endDateFormatted);
    this.onLoadReport(startDateFormatted, endDateFormatted);
    this.onLoadSummaryCustomer(startDateFormatted, endDateFormatted);
    this.onRequestsAttended(startDateFormatted, endDateFormatted);
    this.onRequestsPending();
    this.onLoadDataSummaryIndividual(startDateFormatted, endDateFormatted);
    this.onLoadDataTotalRequests(startDateFormatted, endDateFormatted);
    this.onLoadSummaryCustomer(startDateFormatted, endDateFormatted);
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MMM-yyyy') || ''; // Formatea la fecha
  }

  GenerateWeeklyReport() {
    const urlApi = `LegalReport/GenerateWeeklyReport/${this.startDate}/${
      this.endDate
    }/${true}`;
    const nameReport = 'Reporte Legal';

    this.apiRequestS.onDownloadFile(urlApi, nameReport);
  }
}
