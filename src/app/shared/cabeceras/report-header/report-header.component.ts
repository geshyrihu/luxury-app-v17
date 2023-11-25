import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { DataService } from 'src/app/core/services/data.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  standalone: true,
})
export default class ReportHeaderComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);

  logoLuxury = `${environment.base_urlImg}logo2.jpg`;
  @Input()
  nameCustomer: string = '';
  @Input()
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe((resp: any) => {
        this.nameCustomer = resp.body.nameCustomer;
        this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
