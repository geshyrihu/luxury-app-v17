import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-resultado-general-evaluacion-areas-detalle',
  templateUrl: './resultado-general-evaluacion-areas-detalle.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    TableModule,
    MultiSelectModule,

    EStatusPipe,
  ],
})
export default class ResultadoGeneralEvaluacionAreasDetalleComponent
  implements OnInit, OnDestroy
{
  dataService = inject(DataService);
  config = inject(DynamicDialogConfig);
  customToastService = inject(CustomToastService);

  data: any;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit() {
    this.onLoadData(
      this.config.data.fecha,
      this.config.data.area,
      this.config.data.status
    );
  }

  onLoadData(fecha: string, area: EAreaMinutasDetalles, status?: EStatusTask) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`ResumenGeneral/EvaluacionAreasDetalle/${fecha}/${area}/${status}`)
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
