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
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);
  periodoMonthService = inject(PeriodoMonthService);
  dateS = inject(DateService);

  @Input() title: string | undefined;
  @Input() periodo: string = this.dateS.formatDateTimeToMMMMAAAA(
    this.periodoMonthService.getPeriodoInicio
  );

  nameCustomer: string = '';
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `Customers/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.nameCustomer = responseData.nameCustomer;
      this.logoCustomer = responseData.photoPath;
    });
  }
}
