import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { DataService } from 'src/app/core/services/data.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-maintenance-header',
  templateUrl: './report-maintenance-header.component.html',
  standalone: true,
})
export default class ReportMaintenanceHeaderComponent
  implements OnInit, OnDestroy
{
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);

  nameCustomer: string = '';
  logoCustomer: string = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.filterReportOperationService.setIdCustomer(
        this.customerIdService.customerId
      );
      this.onLoadData();
    });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .subscribe({
        next: (resp: any) => {
          this.nameCustomer = resp.body.nameCustomer;
          this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
