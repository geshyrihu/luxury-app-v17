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
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [MessageService, DialogService, CustomToastService],
})
export default class PresupuestoAddComponent implements OnInit {
  config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  apiRequestService = inject(ApiRequestService);
  public dateService = inject(DateService);
  public messageService = inject(MessageService);
  public rangoCalendarioService = inject(FiltroCalendarService);
  ref = inject(DynamicDialogRef);
  authService = inject(AuthService);

  periodo: IPresupuestoAdd;
  id: number = 0;
  submitting: boolean = false;

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.periodo = {
      customerId: this.customerIdService.customerId,
      from: this.dateService.formatDateTime(
        this.rangoCalendarioService.fechaInicial
      ),
      to: this.dateService.formatDateTime(
        this.rangoCalendarioService.fechaFinal
      ),
    };

    this.rangoCalendarioService.fechas$.subscribe((resp: IFechasFiltro) => {
      this.periodo = {
        customerId: this.customerIdService.customerId,
        from: resp.fechaInicio,
        to: resp.fechaFinal,
      };
    });
  }

  onSubmit() {
    this.submitting = true;
    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Presupuesto/Create`, this.periodo)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Presupuesto/UpdatePresupuesto/${this.id}`, this.periodo)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onLoadData() {
    this.apiRequestService.onGetList('banks').then((result: any) => {
      this.periodo = {
        customerId: this.customerIdService.customerId,
        from: result.fechaInicio,
        to: result.fechaFinal,
      };
    });
  }
}
