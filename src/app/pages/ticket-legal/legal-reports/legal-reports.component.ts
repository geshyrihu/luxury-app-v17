import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import TicketDateRangeSelectorComponent from '../../tickets-v3/shared/ticket-date-range-selector/ticket-date-range-selector.component';

@Component({
  selector: 'app-legal-reports',
  templateUrl: './legal-reports.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, TicketDateRangeSelectorComponent],
  providers: [DatePipe], // Provide DatePipe in the component
})
export default class LegalReportsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  datePipe = inject(DatePipe);
  // Declaración e inicialización de variables
  data: any;
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
      this.onLoadData(formattedStartDate, formattedEndDate),
      this.onLoadSummaryCustomer(formattedStartDate, formattedEndDate),
      this.onLoadDataSummaryIndividual(formattedStartDate, formattedEndDate),
      this.onLoadDataTotalRequests(formattedStartDate, formattedEndDate),
    ]);
  }

  onLoadData(startDate: string, endDate: string) {
    const urlApi = `LegalReport/Summary/${startDate}/${endDate}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onLoadSummaryCustomer(startDate: string, endDate: string) {
    const urlApi = `LegalReport/SummaryCustomer/${startDate}/${endDate}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.summaryCustomer = result;
    });
  }

  onLoadDataSummaryIndividual(startDate: string, endDate: string) {
    const urlApi = `LegalReport/SummaryIndividual/${startDate}/${endDate}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.summaryIndividual = result;
    });
  }
  onLoadDataTotalRequests(startDate: string, endDate: string) {
    const urlApi = `LegalReport/TotalRequests/${startDate}/${endDate}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.totalRequests = result;
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
    this.onLoadDataSummaryIndividual(startDateFormatted, endDateFormatted);
    this.onLoadSummaryCustomer(startDateFormatted, endDateFormatted);
    this.onLoadDataTotalRequests(startDateFormatted, endDateFormatted);
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MMM-yyyy') || ''; // Formatea la fecha
  }
}