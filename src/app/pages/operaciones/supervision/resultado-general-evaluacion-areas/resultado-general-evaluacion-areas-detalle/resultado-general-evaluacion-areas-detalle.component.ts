import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { SanitizeHtmlPipe } from 'src/app/core/pipes/sanitize-html.pipe';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-resultado-general-evaluacion-areas-detalle',
  templateUrl: './resultado-general-evaluacion-areas-detalle.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    TableModule,
    MultiSelectModule,
    SanitizeHtmlPipe,
    EStatusPipe,
  ],
  providers: [CustomToastService],
})
export default class ResultadoGeneralEvaluacionAreasDetalleComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  public config = inject(DynamicDialogConfig);
  public customToastService = inject(CustomToastService);

  data: any;
  subRef$: Subscription;

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
    this.subRef$ = this.dataService
      .get(`ResumenGeneral/EvaluacionAreasDetalle/${fecha}/${area}/${status}`)
      .subscribe({
        next: (resp: any) => {
          // Cuando se obtienen los datos con éxito, actualizar la variable 'data' y ocultar el mensaje de carga
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
