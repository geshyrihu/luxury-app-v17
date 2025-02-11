import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditFormaPagoComponent from './addoredit-forma-pago.component';

@Component({
    selector: 'app-list-forma-pago',
    templateUrl: './list-forma-pago.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListFormaPagoComponent implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);

  data: any[] = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS.onGetList('FormaPago').then((responseData: any) => {
      this.data = responseData;
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`FormaPago/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditFormaPagoComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
