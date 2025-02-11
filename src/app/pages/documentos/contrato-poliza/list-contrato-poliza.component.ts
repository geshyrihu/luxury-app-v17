import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { differenceInDays } from 'date-fns';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditContratoPolizaComponent from './addoredit-contrato-poliza.component';

@Component({
  selector: 'app-contrato-poliza',
  templateUrl: './list-contrato-poliza.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListContratoPolizaComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `ContratoPoliza/GetAll/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`contratopoliza/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditContratoPolizaComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDeleteDocument(id: number) {
    const urlApi = `ContratoPoliza/DeleteDocument/${id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.onLoadData();
    });
  }
  // Suponiendo que 'item.endDate' es una fecha en formato ISO o de tipo Date
  isCloseToEndDate(endDate: string | Date): boolean {
    const today = new Date();
    const end = new Date(endDate);
    const daysDifference = differenceInDays(end, today);
    return daysDifference <= 45;
  }
}
