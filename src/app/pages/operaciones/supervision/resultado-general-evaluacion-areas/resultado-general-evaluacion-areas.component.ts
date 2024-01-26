import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';
import ResultadoGeneralEvaluacionAreasDetalleComponent from './resultado-general-evaluacion-areas-detalle/resultado-general-evaluacion-areas-detalle.component';

@Component({
  selector: 'app-evaluacion-areas',
  templateUrl: './resultado-general-evaluacion-areas.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, TableModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class EvaluacionAreasComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  public customToastService = inject(CustomToastService);

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
