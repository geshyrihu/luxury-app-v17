import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateRangeStorageService } from '../../services/date-range-storage.service';

@Component({
  selector: 'app-ticket-message-weekly-report-preview',
  templateUrl: './ticket-message-weekly-report-preview.component.html',
  standalone: true,
  imports: [],
})
export default class TicketMessageWeeklyReportPreviewComponent
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  dateRangeStorageService = inject(DateRangeStorageService);

  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  // Modificamos la declaración de dateRange para que use un objeto con from y to
  dateRange: { from: Date | null; to: Date | null } = { from: null, to: null };

  ngOnInit(): void {
    // Recuperar las fechas guardadas cuando el componente se inicializa
    const savedDateRange = this.dateRangeStorageService.getDateRange();
    if (savedDateRange && savedDateRange.from && savedDateRange.to) {
      this.dateRange = savedDateRange;
    }

    // Asegurar que haya fechas antes de cargar los datos
    if (this.dateRange.from && this.dateRange.to) {
      this.onLoadData();
    }
  }

  onLoadData() {
    const startDate = this.dateRange.from?.toISOString().split('T')[0]; // Convertir la fecha a string en formato 'YYYY-MM-DD'
    const endDate = this.dateRange.to?.toISOString().split('T')[0];

    const urlApi = `TicketReport/WeeklyReportPreview/${this.customerIdService.customerId}/${startDate}/${endDate}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result);
    });
  }
}
