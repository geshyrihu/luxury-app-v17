import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { IFechasFiltro } from 'src/app/core/interfaces/fechas-filtro.interface';
import { IPresupuestoAdd } from 'src/app/core/interfaces/presupuesto-add.interfase';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';

@Component({
    selector: 'app-presupuesto-add',
    templateUrl: './presupuesto-add.component.html',
    imports: [LuxuryAppComponentsModule],
    providers: [MessageService, DialogService, CustomToastService]
})
export default class PresupuestoAddComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  apiRequestS = inject(ApiRequestService);
  dateS = inject(DateService);
  messageS = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);

  periodo: IPresupuestoAdd;
  id: number = 0;
  submitting: boolean = false;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.periodo = {
      customerId: this.customerIdS.customerId,
      from: this.dateS.formatDateTime(this.rangoCalendarioService.fechaInicial),
      to: this.dateS.formatDateTime(this.rangoCalendarioService.fechaFinal),
    };

    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.periodo = {
        customerId: this.customerIdS.customerId,
        from: resp.fechaInicio,
        to: resp.fechaFinal,
      };
    });
  }

  onSubmit() {
    this.submitting = true;
    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Presupuesto/Create`, this.periodo)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Presupuesto/UpdatePresupuesto/${this.id}`, this.periodo)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onLoadData() {
    this.apiRequestS.onGetList('banks').then((responseData: any) => {
      this.periodo = {
        customerId: this.customerIdS.customerId,
        from: responseData.fechaInicio,
        to: responseData.fechaFinal,
      };
    });
  }
}
