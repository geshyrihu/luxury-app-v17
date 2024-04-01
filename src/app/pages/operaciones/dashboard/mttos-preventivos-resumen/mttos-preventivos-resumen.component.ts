import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-mttos-preventivos-resumen',
  templateUrl: './mttos-preventivos-resumen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MantenimientosPreventivosResumenComponent
  implements OnInit, OnDestroy
{
  config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public periodoMonthService = inject(PeriodoMonthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  customToastService = inject(CustomToastService);

  data: any[] = [];
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  estatus: number;

  ngOnInit(): void {
    this.estatus = this.config.data.estatus;
    this.onLoadData(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin),
      this.estatus
    );
  }
  onLoadData(fechaInicial: string, fechaFinal: string, status?: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `Dashboard/DashboardOrdenServicio/${this.customerIdService.getcustomerId()}/${fechaInicial}/${fechaFinal}/${status}`
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
