import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
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
  subRef$: Subscription;
  customerId: Number;

  ngOnInit(): void {
    this.customerId = this.customerIdService.getcustomerId();
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        'MeetingDertailsSeguimiento/ResumenPreventivosPresentacion/' +
          this.customerId +
          '/' +
          this.dateService.getDateFormat(
            this.reporteOrdenesServicioService.getDate()
          )
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
    this.subRef$ = this.dataService
      .get(
        'MeetingDertailsSeguimiento/ResumenPreventivosGraficoPresentacion/' +
          this.customerId +
          '/' +
          this.dateService.getDateFormat(
            this.reporteOrdenesServicioService.getDate()
          )
      )
      .subscribe({
        next: (resp: any) => {
          this.dataGraficos = resp.body;
          this.reporteOrdenesServicioService.setDateGrafico(this.dataGraficos);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
