import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import ReporteTicketsComponent from 'src/app/pages/operaciones/supervision/reporte-tickets/reporte-tickets.component';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import { environment } from 'src/environments/environment';
const base_urlImg = environment.base_urlImg;

@Component({
  selector: 'app-report-ticket',
  templateUrl: './report-ticket.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    PagetitleReportComponent,
    ReporteTicketsComponent,
  ],
})
export default class ReportTicketComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  data: any;
  dataResponsable: any;
  dataCargaTicket: any;
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = base_urlImg;
  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });

    this.periodoInicial$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `MaintenanceReport/ticket/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
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
    this.dataService
      .get(
        `MaintenanceReport/ticketresponsable/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.dataResponsable = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    this.dataService
      .get(
        `MaintenanceReport/cargaticket/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.dataCargaTicket = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;
    let noAutorizado = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
      noAutorizado += resp.noAutorizado;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
      noAutorizado,
    };
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
