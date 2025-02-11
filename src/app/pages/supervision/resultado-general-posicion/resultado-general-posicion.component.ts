import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
  selector: 'app-resultado-general-posicion',
  templateUrl: './resultado-general-posicion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ResultadoGeneralPosicionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);

  fechaInicial: string = '';
  fechaFinal: string = '';
  data: any;

  ngOnInit() {
    this.fechaInicial = this.dateS.getDateFormat(
      this.rangoCalendarioService.fechaInicial
    );
    this.fechaFinal = this.dateS.getDateFormat(
      this.rangoCalendarioService.fechaFinal
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.onLoadData(resp.fechaInicio, resp.fechaFinal);
    });
  }

  onLoadData(fechaInicio: string, fechaFinal: string) {
    const urlApi = `ResumenGeneral/Posicion/${fechaInicio}/${fechaFinal}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
