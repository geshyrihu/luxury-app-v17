import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { IChartData } from 'src/app/core/interfaces/chart-data.interface';
import { CustomerIdService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import PagetitleReportComponent from 'src/app/shared/cabeceras/pagetitlereport/pagetitlereport.component';
import CustomBarChartComponent from 'src/app/shared/graficos/ng2-chart/custom-bar-chart/custom-bar-chart.component';
import MultiAxisChartComponent from 'src/app/shared/graficos/primeng-chart/multi-axis-chart/multi-axis-chart.component';
@Component({
  selector: 'app-report-consumos',
  templateUrl: './report-consumos.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CommonModule,
    CustomBarChartComponent,
    PagetitleReportComponent,
    MultiAxisChartComponent,
  ],
  providers: [CustomToastService, MessageService],
})
export default class ReportConsumosComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public customToastService = inject(CustomToastService);
  public dateService = inject(DateService);
  public periodoMonthService = inject(PeriodoMonthService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  medidores: IChartData[] = [];
  title: string = '';
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get<IChartData[]>(
        `MaintenanceReport/DataGraficoMensual/${this.customerIdService.getcustomerId()}/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.medidores = resp.body;
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
