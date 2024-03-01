import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ApiRequestService } from '../../../core/services/api-request.service';
import AddoreditMetodoPagoComponent from './addoredit-metodo-pago.component';
@Component({
  selector: 'app-list-metodo-pago',
  templateUrl: './list-metodo-pago.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMetodoPagoComponent implements OnInit {
  public dialogHandlerService = inject(DialogHandlerService);
  public apiRequestService = inject(ApiRequestService);

  data: any[] = [];

  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestService.onGetList('MetodoPago').then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`MetodoPago/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  showModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditMetodoPagoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
