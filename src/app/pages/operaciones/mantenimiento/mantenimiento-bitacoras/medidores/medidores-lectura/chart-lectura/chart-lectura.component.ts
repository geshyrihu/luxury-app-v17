import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgChartsModule } from 'ng2-charts';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IChartType } from 'src/app/core/interfaces/IChartType.interface';
import { IDataSet } from 'src/app/core/interfaces/IDataSet.interface';
import { IFechasFiltro } from 'src/app/core/interfaces/IFechasFiltro.interface';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-chart-lectura',
  templateUrl: './chart-lectura.component.html',
  standalone: true,
  imports: [NgbModule, ComponentsModule, NgChartsModule, CommonModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ChartLecturaComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private rutaActiva = inject(ActivatedRoute);
  public dateService = inject(DateService);
  public dialogService = inject(DialogService);
  public filtroCalendarService = inject(FiltroCalendarService);
  public customToastService = inject(CustomToastService);

  subRef$: Subscription;

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        `MedidorLectura/DataGraficoDiaria/${this.medidorId}/${this.fechaInicial}/${this.fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.onLoadChart(
            this.data.label,
            this.data.backgroundColor,
            this.data.hoverBackgroundColor,
            this.data.labels,
            this.data.data
          );
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onDataGraficoMensual(fechaInicial: string, fechaFinal: string) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        `MedidorLectura/DataGraficoMensual/${this.medidorId}/${fechaInicial}/${fechaFinal}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.onLoadChart(
            this.data.label,
            this.data.backgroundColor,
            this.data.hoverBackgroundColor,
            this.data.labels,
            this.data.data
          );
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
