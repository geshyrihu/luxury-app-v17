import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { ReporteOrdenesServicioService } from 'src/app/core/services/reporte-ordenes-servicio.service';
import ResumenOrdenesServicioGraficoComponent from '../resumen-ordenes-servicio-grafico/resumen-ordenes-servicio-grafico.component';

@Component({
  selector: 'app-resumen-ordenes-servicio',
  templateUrl: './resumen-ordenes-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ResumenOrdenesServicioGraficoComponent],
})
export default class ResumenOrdenesServicioComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);

  data: any[] = [];
  dataGraficos: any[] = [];
  concluidos = 0;
  pendientes = 0;
  noAutorizados = 0;
  grafico: any;
  urlImg: string = '';

  customerId: Number;

  ngOnInit(): void {
    this.customerId = this.customerIdS.getCustomerId();
    this.onLoadData();
  }

  onLoadData() {
    const urlApi =
      'MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/' +
      this.customerId +
      '/' +
      this.dateS.getDateFormat(this.reporteOrdenesServicioService.getDate());
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });

    const urlApi2 =
      'MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/' +
      this.customerId +
      '/' +
      this.dateS.getDateFormat(this.reporteOrdenesServicioService.getDate());
    this.apiRequestS.onGetList(urlApi2).then((responseData: any) => {
      this.dataGraficos = responseData;
      this.reporteOrdenesServicioService.setDateGrafico(this.dataGraficos);
    });
  }
}
