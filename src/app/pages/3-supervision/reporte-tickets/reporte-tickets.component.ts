import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-reporte-tickets',
  templateUrl: './reporte-tickets.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteTicketsComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onFiltrarPeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ResumenGeneral/ReporteResumenTicket/${
      this.customerIdService.customerId
    }/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoFin
    )}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onSumaTotales(data: any[]) {
    let solicitudes = 0;
    let atendidas = 0;
    let pendientes = 0;

    data.forEach((resp) => {
      solicitudes += resp.solicitudes;
      atendidas += resp.atendidas;
      pendientes += resp.pendientes;
    });

    return {
      solicitudes,
      atendidas,
      pendientes,
    };
  }
}
