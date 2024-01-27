import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Subject, takeUntil } from 'rxjs';
import { EStatusPipe } from 'src/app/core/pipes/status.pipe';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { ReporteOrdenesServicioService } from 'src/app/core/services/reporte-ordenes-servicio.service';
import ComponentsModule from 'src/app/shared/components.module';
import ResumenOrdenesServicioGraficoComponent from '../resumen-ordenes-servicio-grafico/resumen-ordenes-servicio-grafico.component';
@Component({
  selector: 'app-resumen-ordenes-servicio',
  templateUrl: './resumen-ordenes-servicio.component.html',
  standalone: true,
  imports: [
    ResumenOrdenesServicioGraficoComponent,
    CommonModule,
    ComponentsModule,
    TableModule,
    EStatusPipe,
  ],
  providers: [CustomToastService],
})
export default class ResumenOrdenesServicioComponent
  implements OnInit, OnDestroy
{
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  public customToastService = inject(CustomToastService);

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
