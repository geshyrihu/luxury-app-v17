import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  standalone: true,
})
export default class ReportHeaderComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  filterReportOperationService = inject(TicketFilterService);

  logoLuxury = ``;
  @Input()
  nameCustomer: string = '';
  @Input()
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.filterReportOperationService.setIdCustomer(
        this.customerIdS.customerId
      );
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
