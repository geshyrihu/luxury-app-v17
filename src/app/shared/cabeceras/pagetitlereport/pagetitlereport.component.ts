import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-pagetitlereport',
  templateUrl: './pagetitlereport.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [CustomToastService],
})

/**
 * Page Title Component
 */
export default class PagetitleReportComponent {
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public periodoMonthService = inject(PeriodoMonthService);
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);

  @Input() title: string | undefined;
  // @Input() titulo: string;
  @Input() periodo: string = this.dateService.formatDateTimeToMMMMAAAA(
    this.periodoMonthService.getPeriodoInicio
  );

  nameCustomer: string = '';
  logoCustomer: string = '';

  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
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
