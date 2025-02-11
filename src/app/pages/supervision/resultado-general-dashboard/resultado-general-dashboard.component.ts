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
    imports: [LuxuryAppComponentsModule, MultiSelectModule]
})
export default class ResultadoGeneralDashboardComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  periodoMonthService = inject(PeriodoMonthService);
  dateS = inject(DateService);

  reporteFiltro: string = 'MINUTAS GENERAL';

  ref: DynamicDialogRef;
  data: any[] = [];
  cb_customers: any[] = [];
  periodo: string = '';
  nivelReporte: number = 0;
  mostrar: boolean = false;

  ngOnInit(): void {
    this.apiRequestS.onGetSelectItem(`NombreCorto`).then((response: any) => {
      this.cb_customers = response.map((selectList: any) => ({
        label: selectList.label,
      }));
    });

    this.periodo = this.dateS.getNameMontYear(
      this.periodoMonthService.fechaInicial
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.periodo = this.dateS.getNameMontYear(
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

    const urlApi = `ResumenGeneral/ReporteResumenMinutas/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoFin)}/${
      this.nivelReporte
    }`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onLoadDataMinutaFiltro(EAreaMinutasDetalles: number, reporteFiltro: string) {
    const urlApi = `ResumenGeneral/ReporteResumenMinutasFiltro/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoFin
    )}/${EAreaMinutasDetalles}/${this.nivelReporte}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onLoadDataPreventivos() {
    const urlApi = `ResumenGeneral/ReporteResumenPreventivos/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoFin)}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onLoadDataTickets() {
    const urlApi = `ResumenGeneral/ReporteResumenTicket/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoFin)}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
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
