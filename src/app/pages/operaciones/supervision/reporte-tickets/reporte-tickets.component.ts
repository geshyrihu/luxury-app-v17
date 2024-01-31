import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import { environment } from 'src/environments/environment';
const base_urlImg = environment.base_urlImg + 'Administration/accounts/';

@Component({
  selector: 'app-reporte-tickets',
  templateUrl: './reporte-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ReporteTicketsComponent],
})
export default class ReporteTicketsComponent implements OnInit, OnDestroy {
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  public customToastService = inject(CustomToastService);

  base_urlImg = '';
  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = base_urlImg;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
    this.urlImg(this.customerIdService.getcustomerId());
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.urlImg(this.customerIdService.getcustomerId());
      this.onLoadData();
    });
  }
  urlImg(customerId: number): void {
    this.base_urlImg = `${environment.base_urlImg}customers/${customerId}/tools/`;
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
