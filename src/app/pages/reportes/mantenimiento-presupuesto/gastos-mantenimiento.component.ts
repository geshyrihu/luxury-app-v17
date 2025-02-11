import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import MaintenancePreventiveAddoreditComponent from 'src/app/pages/calendar/mantenimiento-preventivo/maintenance-preventive-addoredit.component';

@Component({
    selector: 'app-gastos-mantenimiento',
    templateUrl: './gastos-mantenimiento.component.html',
    imports: [LuxuryAppComponentsModule],
    providers: [MessageService, DialogService, CustomToastService]
})
export default class GastosMantenimientoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any[] = [];
  resumenGastos: any[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  totalGasto: number = 0;
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `PresupuestoMantenimiento/SummaryOfExpenses/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData.items;
      this.totalGasto = responseData.totalGastos;
    });

    const urlApi2 = `PresupuestoMantenimiento/Resumengastos/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi2).then((responseData: any) => {
      this.resumenGastos = responseData;
    });
  }
  onModalItem(item: any) {
    this.dialogHandlerS
      .openDialog(
        MaintenancePreventiveAddoreditComponent,
        {
          id: item.id,
          task: 'edit',
          idMachinery: item.idEquipo,
        },
        'Editar regitro',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
