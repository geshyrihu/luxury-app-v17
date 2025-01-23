import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  standalone: true,
})
export default class ReportHeaderComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  filterReportOperationService = inject(TicketFilterService);

  logoLuxury = `${environment.base_urlImg}logo2.jpg`;
  @Input()
  nameCustomer: string = '';
  @Input()
  logoCustomer: string = '';

  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.custIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.filterReportOperationService.setIdCustomer(
        this.custIdService.customerId
      );
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `Customers/${this.custIdService.customerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.nameCustomer = result.nameCustomer;
      this.logoCustomer = `${environment.base_urlImg}Administration/customer/${result.photoPath}`;
    });
  }
}
