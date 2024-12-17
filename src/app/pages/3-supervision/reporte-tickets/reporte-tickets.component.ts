import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-reporte-tickets',
  templateUrl: './reporte-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ReporteTicketsComponent],
})
export default class ReporteTicketsComponent implements OnInit, OnDestroy {
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataConnectorService);
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  customToastService = inject(CustomToastService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenTicket/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
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
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
    };
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
