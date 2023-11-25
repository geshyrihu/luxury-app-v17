import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { ResultadoGeneralService } from 'src/app/core/services/resultado-general.service';

@Component({
  selector: 'app-grafico-resultado-general',
  templateUrl: './resultado-general-grafico.component.html',
  standalone: true,
  imports: [CommonModule],
})
export default class ResultadoGeneralGraficoComponent implements OnInit {
  private resultadoGeneralService = inject(ResultadoGeneralService);
  private rangoCalendarioService = inject(FiltroCalendarService);

  tituloInicio: any = this.rangoCalendarioService.fechaFinal;
  tituloFin: any = this.rangoCalendarioService.fechaFinal;
  graficoMinutas: any = [];
  graficoMttoPreventivos: any = [];
  graficosMantenimiento: any = [];
  graficoMinutasContable: any = [];
  graficoMinutasOperaciones: any = [];
  graficoMinutasLegal: any = [];
  totalMinutasLegal: number = 0;
  totalMinutas: number = 0;
  totalMttoPreventivos: number = 0;
  totalsMantenimiento: number = 0;
  totalMinutasContable: number = 0;
  totalMinutasOperaciones: number = 0;

  ngOnInit(): void {
    this.onSetDataGraficos(this.resultadoGeneralService.dataGrafico);
  }

  onValidateNan(date): boolean {
    return !isNaN(date);
  }

  onSetDataGraficos(data: any) {
    this.graficoMinutas = [];
    this.graficoMttoPreventivos = [];
    this.graficosMantenimiento = [];
    this.graficoMinutasContable = [];
    this.graficoMinutasOperaciones = [];
    this.graficoMinutasLegal = [];
    data.forEach((element) => {
      if (element.concepto.label == 'Minuta') {
        this.graficoMinutas.push(element);
      }
      if (element.concepto.label == 'Mttos Preventivos') {
        this.graficoMttoPreventivos.push(element);
      }
      if (element.concepto.label == 'Mttos Correctivos') {
        this.graficosMantenimiento.push(element);
      }
      if (element.concepto.label == 'Minuta-Contable') {
        this.graficoMinutasContable.push(element);
      }
      if (element.concepto.label == 'Minuta-Operaciones') {
        this.graficoMinutasOperaciones.push(element);
      }
      if (element.concepto.label == 'Minuta-Legal') {
        this.graficoMinutasLegal.push(element);
      }
    });

    this.graficoMinutas = this.onFilter(this.graficoMinutas);
    this.graficoMttoPreventivos = this.onFilter(this.graficoMttoPreventivos);
    this.graficosMantenimiento = this.onFilter(this.graficosMantenimiento);
    this.graficoMinutasContable = this.onFilter(this.graficoMinutasContable);
    this.graficoMinutasOperaciones = this.onFilter(
      this.graficoMinutasOperaciones
    );
    this.graficoMinutasLegal = this.onFilter(this.graficoMinutasLegal);

    this.totalMinutasLegal = this.graficoMinutasLegal.evaluacionConcluido;
    this.totalMinutas = this.graficoMinutas.evaluacionConcluido;
    this.totalMttoPreventivos = this.graficoMttoPreventivos.evaluacionConcluido;
    this.totalsMantenimiento = this.graficosMantenimiento.evaluacionConcluido;
    this.totalMinutasContable = this.graficoMinutasContable.evaluacionConcluido;
    this.totalMinutasOperaciones =
      this.graficoMinutasOperaciones.evaluacionConcluido;
  }
  onLoadTotal(): number {
    return 0;
  }
  onFilter(data: any) {
    let grafico: any;
    let pendienteCount: number = 0;
    let concluidoCount: number = 0;

    data.forEach((resp) => {
      pendienteCount = pendienteCount + Number(resp.solicitudesPendientes);
      concluidoCount = concluidoCount + Number(resp.solicitudesAtendidas);
    });

    grafico = {
      totalConcluido: concluidoCount,
      evaluacionConcluido: this.onEvaluation(pendienteCount, concluidoCount),
      totalItems: pendienteCount + concluidoCount,
      totalPendiente: pendienteCount,
      evaluacionPendiente: this.onEvaluation(concluidoCount, pendienteCount),
      textEvaluacion: this.onLoadTitle(
        this.onEvaluation(pendienteCount, concluidoCount)
      ),
    };

    return grafico;
  }
  onEvaluation(pendiente: number, concluido: number): number {
    let total: number = pendiente + concluido;
    let procentajePositivo: number = concluido / total;
    let resultadoredondo: number = Math.round(procentajePositivo * 100);
    return resultadoredondo;
  }
  onLoadTitle(dataEvaluacion: any): string {
    if (dataEvaluacion <= 94) {
      return 'RIESGO';
    }
    if (dataEvaluacion >= 100) {
      return 'EXCELENTE';
    }
    if (dataEvaluacion >= 95 && dataEvaluacion <= 99) {
      return 'REGULAR';
    }else{
      return'';
    }
  }
}
