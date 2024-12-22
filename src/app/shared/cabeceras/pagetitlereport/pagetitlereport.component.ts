import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'page-title-report',
  templateUrl: './pagetitlereport.component.html',
  standalone: true,
  imports: [CommonModule],
})

/**
 * Page Title Component
 */
export default class PagetitleReportComponent {
  customerIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);
  periodoMonthService = inject(PeriodoMonthService);
  dateService = inject(DateService);

  @Input() title: string | undefined;
  @Input() periodo: string = this.dateService.formatDateTimeToMMMMAAAA(
    this.periodoMonthService.getPeriodoInicio
  );

  nameCustomer: string = '';
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `Customers/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = result.photoPath;
    });
  }
}
