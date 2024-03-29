import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IFilterTicket } from 'src/app/core/interfaces/IFilterTicket.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  ReportService,
  TicketFilterService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-pending-report',
  templateUrl: './pending-report.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class PendingReportComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public filterReportOperationService = inject(TicketFilterService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);
  urlImg = '';
  data: any[] = [];
  customerId: number;
  nameCustomer: string = '';
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.customerId = this.reportService.getCustomerId();
    this.urlImg = `${
      environment.base_urlImg
    }customers/${this.filterReportOperationService.getIdCustomer()}/report/`;
    this.dataService
      .post<IFilterTicket>(
        'Ticket/GetReportPending',
        this.filterReportOperationService.getfilterTicket
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
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
