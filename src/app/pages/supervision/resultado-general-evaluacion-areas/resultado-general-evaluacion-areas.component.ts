import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import ResultadoGeneralEvaluacionAreasDetalleComponent from './resultado-general-evaluacion-areas-detalle.component';

@Component({
    selector: 'app-evaluacion-areas',
    templateUrl: './resultado-general-evaluacion-areas.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class EvaluacionAreasComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any[] = [];

  ngOnInit() {
    this.fechaInicial = this.dateS.getDateFormat(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateS.getDateFormat(
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
    const urlApi = `ResumenGeneral/EvaluacionAreas/${fechaInicio}/${fechaFinal}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onModalFiltroMinutasArea(fecha: string, area: number, status?: number) {
    this.dialogHandlerS.openDialog(
      ResultadoGeneralEvaluacionAreasDetalleComponent,
      {
        fecha: fecha,
        area: area,
        status: status,
      },
      '',
      this.dialogHandlerS.dialogSizeFull
    );
  }
}
