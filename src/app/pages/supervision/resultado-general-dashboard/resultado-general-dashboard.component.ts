import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-resultado-general-dashboard',
  templateUrl: './resultado-general-dashboard.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, MultiSelectModule],
})
export default class ResultadoGeneralDashboardComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  periodoMonthService = inject(PeriodoMonthService);
  dateService = inject(DateService);

  reporteFiltro: string = 'MINUTAS GENERAL';

  ref: DynamicDialogRef;
  data: any[] = [];
  cb_customers: any[] = [];
  periodo: string = '';
  nivelReporte: number = 0;
  mostrar: boolean = false;

  ngOnInit(): void {
    this.apiRequestService
      .onGetSelectItem(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers = response.map((selectList: any) => ({
          label: selectList.label,
        }));
      });

    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateService.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarData(item: string) {
    this.reporteFiltro = item;
    this.onLoadDataMinutas();
  }

  onLoadDataMinutas() {
    this.reporteFiltro = 'MINUTAS GENERAL';
    // Mostrar un mensaje de carga

    const urlApi = `ResumenGeneral/ReporteResumenMinutas/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoFin
    )}/${this.nivelReporte}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onLoadDataMinutaFiltro(EAreaMinutasDetalles: number, reporteFiltro: string) {
    const urlApi = `ResumenGeneral/ReporteResumenMinutasFiltro/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoFin
    )}/${EAreaMinutasDetalles}/${this.nivelReporte}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onLoadDataPreventivos() {
    const urlApi = `ResumenGeneral/ReporteResumenPreventivos/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoFin
    )}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onLoadDataTickets() {
    const urlApi = `ResumenGeneral/ReporteResumenTicket/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoFin
    )}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onValueProgress(value: number) {
    let color = '';
    if (value <= 94) {
      color = 'danger';
    }
    if (value >= 100) {
      color = 'success';
    }
    if (value >= 95 && value <= 99) {
      color = 'warning';
    }
    return color;
  }
}
