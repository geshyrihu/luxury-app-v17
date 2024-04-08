import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { NgChartsModule } from 'ng2-charts';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IChartType } from 'src/app/core/interfaces/chart-type.interface';
import { IDataSet } from 'src/app/core/interfaces/data-set.interface';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
@Component({
  selector: 'app-chart-lectura',
  templateUrl: './chart-lectura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgChartsModule],
})
export default class ChartLecturaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  rutaActiva = inject(ActivatedRoute);
  dateService = inject(DateService);
  filtroCalendarService = inject(FiltroCalendarService);

  data: IDataSet;
  title: string = '';
  ViewMonth: boolean = false;
  ViewDay: boolean = true;
  medidorId: number = 0;
  dates$: Observable<Date[]> = this.filtroCalendarService.getDates$();

  fechaInicial: string = this.dateService.getDateFormat(
    this.filtroCalendarService.fechaInicioDateFull
  );
  fechaFinal: string = this.dateService.getDateFormat(
    this.filtroCalendarService.fechaFinalDateFull
  );

  ref: DynamicDialogRef;

  onCheckboxChange() {
    this.ViewMonth = !this.ViewMonth;
    this.ViewDay = !this.ViewDay;

    this.onLoadData();
  }

  onLoadData() {
    if (this.ViewMonth) {
      this.onDataGraficoMensual(
        this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
        this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
      );
    }
    if (this.ViewDay) {
      this.onDataGraficoDiaria();
    }
  }

  ngOnInit(): void {
    this.medidorId = this.rutaActiva.snapshot.params.id;
    this.onLoadData();
    this.filtroCalendarService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.fechaInicial = resp.fechaInicio;
      this.fechaFinal = resp.fechaFinal;
      this.onLoadData();
    });
    this.dates$.subscribe((dates) => {
      this.onDataGraficoMensual(
        this.dateService.getDateFormat(dates[0]),
        this.dateService.getDateFormat(dates[1])
      );
    });
  }

  onDataGraficoDiaria() {
    const urlApi = `MedidorLectura/DataGraficoDiaria/${this.medidorId}/${this.fechaInicial}/${this.fechaFinal}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onLoadChart(
        this.data.label,
        this.data.backgroundColor,
        this.data.hoverBackgroundColor,
        this.data.labels,
        this.data.data
      );
    });
  }

  onDataGraficoMensual(fechaInicial: string, fechaFinal: string) {
    const urlApi = `MedidorLectura/DataGraficoMensual/${this.medidorId}/${fechaInicial}/${fechaFinal}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onLoadChart(
        this.data.label,
        this.data.backgroundColor,
        this.data.hoverBackgroundColor,
        this.data.labels,
        this.data.data
      );
    });
  }
  lineBarChart: IChartType;
  // lineBarChartDiario: ChartType;
  onLoadChart(
    label: string,
    backgroundColor: string,
    hoverBackgroundColor: string,
    labels: string[],
    data: any
  ) {
    this.lineBarChart = {
      labels: labels,
      datasets: [
        {
          label: label,
          // backgroundColor: 'rgba(52, 195, 143, 0.8)',
          backgroundColor: backgroundColor,
          // borderColor: 'rgba(52, 195, 143, 0.8)',
          borderColor: backgroundColor,
          borderWidth: 1,
          // hoverBackgroundColor: 'rgba(52, 195, 143, 0.9)',
          // hoverBorderColor: 'rgba(52, 195, 143, 0.9)',
          hoverBackgroundColor: hoverBackgroundColor,
          hoverBorderColor: hoverBackgroundColor,
          data: data,
          barPercentage: 0.4,
        },
      ],
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: 'rgba(166, 176, 207, 0.1)',
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: 'rgba(166, 176, 207, 0.1)',
              },
            },
          ],
        },
      },
    };
  }
}
