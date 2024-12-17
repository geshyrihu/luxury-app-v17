import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';

@Component({
  selector: 'app-resumen-mantenimientos',
  templateUrl: './resumen-mantenimientos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ResumenMantenimientosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateService = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  data: any;
  dataProvider: any = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  periodoInicial$: Observable<Date> =
    this.periodoMonthService.getPeriodoInicial$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });

    this.periodoInicial$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `MaintenanceReport/resumen/${
      this.customerIdService.customerId
    }/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
    const urlApi2 = `MaintenanceReport/proveedor/${
      this.customerIdService.customerId
    }/${this.dateService.getDateFormat(
      this.periodoMonthService.getPeriodoInicio
    )}`;
    this.apiRequestService.onGetList(urlApi2).then((result: any) => {
      this.dataProvider = result;
    });
  }
}
