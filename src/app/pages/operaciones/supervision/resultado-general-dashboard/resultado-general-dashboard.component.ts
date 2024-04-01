import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-resultado-general-dashboard',
  templateUrl: './resultado-general-dashboard.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, MultiSelectModule],
})
export default class ResultadoGeneralDashboardComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  customToastService = inject(CustomToastService);

  reporteFiltro: string = 'MINUTAS GENERAL';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ref: DynamicDialogRef;
  data: any[] = [];
  cb_customers: any[] = [];
  periodo: string = '';
  nivelReporte: number = 0;
  mostrar: boolean = false;

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers = response.map((selectList: any) => ({
          label: selectList.label,
        }));
      });

    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarData(item: string) {
    this.reporteFiltro = item;
    this.onLoadDataMinutas();
  }

  onLoadDataMinutas() {
    this.reporteFiltro = 'MINUTAS GENERAL';
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenMinutas/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}/${this.nivelReporte}`
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
  onLoadDataMinutaFiltro(EAreaMinutasDetalles: number, reporteFiltro: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenMinutasFiltro/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}/${EAreaMinutasDetalles}/${this.nivelReporte}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteFiltro = reporteFiltro;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadDataPreventivos() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenPreventivos/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteFiltro = 'MANTENIMIENTOS PREVENTIVOS';
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadDataTickets() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `ResumenGeneral/ReporteResumenTicket/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoFin
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteFiltro = 'TICKETS';
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onValueProgress(value: number) {
    let color = '';
    if (value <= 94) {
      color = 'danger';
    }
    if (value >= 100) {
      color = 'success';
    }
    if (value >= 95 && value <= 99) {
      color = 'warning';
    }
    return color;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
