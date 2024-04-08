import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { ReporteOrdenesServicioService } from 'src/app/core/services/reporte-ordenes-servicio.service';
import ResumenOrdenesServicioGraficoComponent from '../resumen-ordenes-servicio-grafico/resumen-ordenes-servicio-grafico.component';
@Component({
  selector: 'app-resumen-ordenes-servicio',
  templateUrl: './resumen-ordenes-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, ResumenOrdenesServicioGraficoComponent],
})
export default class ResumenOrdenesServicioComponent
  implements OnInit, OnDestroy
{
  customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  customToastService = inject(CustomToastService);

  data: any[] = [];
  dataGraficos: any[] = [];
  concluidos = 0;
  pendientes = 0;
  noAutorizados = 0;
  grafico: any;
  // date: Date;
  urlImg: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  customerId: Number;

  ngOnInit(): void {
    this.customerId = this.customerIdService.getcustomerId();
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        'MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/' +
          this.customerId +
          '/' +
          this.dateService.getDateFormat(
            this.reporteOrdenesServicioService.getDate()
          )
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
    this.dataService
      .get(
        'MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/' +
          this.customerId +
          '/' +
          this.dateService.getDateFormat(
            this.reporteOrdenesServicioService.getDate()
          )
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.dataGraficos = resp.body;
          this.reporteOrdenesServicioService.setDateGrafico(this.dataGraficos);
          this.customToastService.onClose();
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
