import {} from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import { DataService } from 'src/app/core/services/data.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-haeder-customer',
  templateUrl: './haeder-customer.component.html',
  standalone: true,

  providers: [CustomToastService],
})
export default class HaederCustomerComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public filterReportOperationService = inject(TicketFilterService);
  public customToastService = inject(CustomToastService);

  logoCustomer = '';
  nameCustomer = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  @Input()
  title: string = 'Titulo de cabecera';
  @Input()
  subTitle: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.dataService
      .get(`Customers/${this.customerIdService.customerId}`)
      .pipe(takeUntil(this.destroy$))
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
