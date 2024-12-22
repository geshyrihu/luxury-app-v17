import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ServiceOrderAddOrEditComponent from '../../../5.3-mantenimiento/service-order/addoredit-service-order.component';

@Component({
  selector: 'app-service-history-machinery',
  templateUrl: './service-history-machinery.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ServiceHistoryMachineryComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);

  id: number = this.config.data.id;

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Machineries/ServiceHistory/${this.config.data.id}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        ServiceOrderAddOrEditComponent,
        {
          id: data.id,
          machineryId: data.machineryId,
          providerId: data.providerId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
