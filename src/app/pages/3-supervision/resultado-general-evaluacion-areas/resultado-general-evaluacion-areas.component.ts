import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataConnectorService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import ResultadoGeneralEvaluacionAreasDetalleComponent from './resultado-general-evaluacion-areas-detalle/resultado-general-evaluacion-areas-detalle.component';

@Component({
  selector: 'app-evaluacion-areas',
  templateUrl: './resultado-general-evaluacion-areas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EvaluacionAreasComponent implements OnInit, OnDestroy {
  dataService = inject(DataConnectorService);
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  customToastService = inject(CustomToastService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any[] = [];

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ref: DynamicDialogRef;

  ngOnInit() {
    this.fechaInicial = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateService.getDateFormat(
      this.rangoCalendarioService.fechaFinal
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechasMOnth$.subscribe(
      (resp: IFechasFiltro) => {
        this.onLoadData(resp.fechaInicio, resp.fechaFinal);
      }
    );
  }
  onLoadData(fechaInicio: string, fechaFinal: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`ResumenGeneral/EvaluacionAreas/${fechaInicio}/${fechaFinal}`)
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

  onModalFiltroMinutasArea(
    fecha: string,
    area: EAreaMinutasDetalles,
    status?: EStatusTask
  ) {
    this.ref = this.dialogService.open(
      ResultadoGeneralEvaluacionAreasDetalleComponent,
      {
        data: {
          fecha,
          area,
          status,
        },
        width: '100%',
        height: '100%',
        closeOnEscape: true,
        baseZIndex: 10000,
        styleClass: 'customFullModal',
      }
    );
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
