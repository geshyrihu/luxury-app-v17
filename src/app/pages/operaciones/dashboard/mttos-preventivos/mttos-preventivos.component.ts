import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { PeriodoMonthService } from 'src/app/core/services/periodo-month.service';
import MantenimientosPreventivosResumenComponent from '../mttos-preventivos-resumen/mttos-preventivos-resumen.component';

@Component({
  selector: 'app-mttos-preventivos',
  templateUrl: './mttos-preventivos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MantenimientosPreventivosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  dateService = inject(DateService);
  customerIdService = inject(CustomerIdService);
  periodoMonthService = inject(PeriodoMonthService);

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ordenesServicio: any = [];

  onChangePeriodo(periodo: string) {
    this.periodoMonthService.setPeriodo(periodo);
    this.onLoadOrdenServicio(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
  }

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadOrdenServicio(
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoInicio),
      this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
    );
    this.customerId$.subscribe(() => {
      this.onLoadOrdenServicio(
        this.dateService.getDateFormat(
          this.periodoMonthService.getPeriodoInicio
        ),
        this.dateService.getDateFormat(this.periodoMonthService.getPeriodoFin)
      );
    });
  }

  onLoadOrdenServicio(fehcaInicio: string, getPeriodoFin: string) {
    const urlApi = `Dashboard/OrdenesServicio/${this.customerIdService.getCustomerId()}/${fehcaInicio}/${getPeriodoFin}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.ordenesServicio = result;
    });
  }

  onClick(estatus?: number) {
    this.dialogHandlerService.openDialog(
      MantenimientosPreventivosResumenComponent,
      {
        estatus,
      },
      'Ordenes de Mantenimiento Preventivo',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
