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
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdS.getCustomerId$();
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
      this.customerIdS.customerId
    }/${this.dateS.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoFin)}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
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
