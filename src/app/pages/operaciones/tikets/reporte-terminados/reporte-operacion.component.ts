import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IFilterTicket } from 'src/app/core/interfaces/filter-ticket.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { ReportService } from 'src/app/core/services/report.service';
import { TicketFilterService } from 'src/app/core/services/ticket-filter.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operation-report',
  templateUrl: './reporte-operacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteOperacionComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  public reportService = inject(ReportService);
  public ticketFilterService = inject(TicketFilterService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  urlImg = '';
  data: any[] = [];
  customerId: number;
  nameCustomer: string = '';
  logoCustomer: string = '';
  roleMantenimiento: boolean = false;

  fechaInicial = '';
  fechaFinal = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.fechaInicial = this.ticketFilterService.filterTicket.finishedStart;
    this.fechaFinal = this.ticketFilterService.filterTicket.finishedEnd;
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.ticketFilterService.setIdCustomer(this.customerIdService.customerId);
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.urlImg = `${environment.base_urlImg}customers/${this.ticketFilterService.filterTicket.customer}/report/`;

    this.dataService
      .post<IFilterTicket>(
        'Ticket/GetReportWeekly',
        this.ticketFilterService.filterTicket
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
