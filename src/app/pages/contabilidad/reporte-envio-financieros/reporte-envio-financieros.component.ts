import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-reporte-envio-financieros',
  templateUrl: './reporte-envio-financieros.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteEnvioFinancierosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  public periodoMonthService = inject(PeriodoMonthService);
  dateService = inject(DateService);

  // Declaración e inicialización de variables
  data: any[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  periodo: string = '';

  ngOnInit(): void {
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadData();
  }

  // Función para cargar los datos de los reporte
  onLoadData() {
    this.apiRequestService
      .onGetList(
        `EstadoFinanciero/reporteenviomensual/${this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        )}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadData();
  }
}
