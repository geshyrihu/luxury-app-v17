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
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  dateS = inject(DateService);
  periodoMonthService = inject(PeriodoMonthService);

  data: any;
  dataProvider: any = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

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
      this.customerIdS.customerId
    }/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoInicio)}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
    const urlApi2 = `MaintenanceReport/proveedor/${
      this.customerIdS.customerId
    }/${this.dateS.getDateFormat(this.periodoMonthService.getPeriodoInicio)}`;
    this.apiRequestS.onGetList(urlApi2).then((responseData: any) => {
      this.dataProvider = responseData;
    });
  }
}
