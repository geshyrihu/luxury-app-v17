import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { EAreaMinutasDetalles } from 'src/app/core/enums/area-minutas-detalles.enum';
import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

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
  implements OnInit
{
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: any;

  ngOnInit() {
    this.onLoadData(
      this.config.data.fecha,
      this.config.data.area,
      this.config.data.status
    );
  }

  onLoadData(fecha: string, area: EAreaMinutasDetalles, status?: EStatusTask) {
    const urlApi = `ResumenGeneral/EvaluacionAreasDetalle/${fecha}/${area}/${status}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
