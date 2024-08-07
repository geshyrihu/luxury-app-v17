import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'page-title-report',
  templateUrl: './pagetitlereport.component.html',
  standalone: true,
  imports: [CommonModule],
})

/**
 * Page Title Component
 */
export default class PagetitleReportComponent implements OnDestroy {
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  periodoMonthService = inject(PeriodoMonthService);
  dateService = inject(DateService);
  customToastService = inject(CustomToastService);

  destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.nameCustomer = resp.body.nameCustomer;
          this.logoCustomer = `${environment.base_urlImg}Administration/customer/${resp.body.photoPath}`;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
