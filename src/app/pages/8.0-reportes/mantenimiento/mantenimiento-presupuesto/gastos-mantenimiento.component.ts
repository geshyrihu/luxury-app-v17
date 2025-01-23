import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditMaintenancePreventiveComponent from 'src/app/pages/5.6-calendar/mantenimiento-preventivo/addoredit-maintenance-preventive.component';

@Component({
  selector: 'app-gastos-mantenimiento',
  templateUrl: './gastos-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [MessageService, DialogService, CustomToastService],
})
export default class GastosMantenimientoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);

  data: any[] = [];
  resumenGastos: any[] = [];
  customerId$: Observable<number> = this.custIdService.getCustomerId$();
  totalGasto: number = 0;
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `MaintenanceCalendars/SummaryOfExpenses/${this.custIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result.items;
      this.totalGasto = result.totalGastos;
    });

    const urlApi2 = `MaintenanceCalendars/Resumengastos/${this.custIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi2).then((result: any) => {
      this.resumenGastos = result;
    });
  }
  onModalItem(item: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditMaintenancePreventiveComponent,
        {
          id: item.id,
          task: 'edit',
          idMachinery: item.idEquipo,
        },
        'Editar regitro',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
