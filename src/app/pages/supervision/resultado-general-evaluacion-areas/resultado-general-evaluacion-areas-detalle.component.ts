import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
    selector: 'app-resultado-general-evaluacion-areas-detalle',
    templateUrl: './resultado-general-evaluacion-areas-detalle.component.html',
    imports: [LuxuryAppComponentsModule, TableModule, MultiSelectModule]
})
export default class ResultadoGeneralEvaluacionAreasDetalleComponent
  implements OnInit
{
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);

  data: any;

  ngOnInit() {
    this.onLoadData(
      this.config.data.fecha,
      this.config.data.area,
      this.config.data.status
    );
  }

  onLoadData(fecha: string, area: number, status?: number) {
    const urlApi = `ResumenGeneral/EvaluacionAreasDetalle/${fecha}/${area}/${status}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
