import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  standalone: true,
})
export default class ReportHeaderComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);

  logoLuxury = `${environment.base_urlImg}logo2.jpg`;
  @Input()
  nameCustomer: string = '';
  @Input()
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.filterReportOperationService.setIdCustomer(
        this.customerIdService.customerId
      );
      this.onLoadData();
    });
  }
  onLoadData() {
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe((resp: any) => {
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
