import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditDocumentoComponent from './addoredit-documento.component';

@Component({
  selector: 'app-list-docuento',
  templateUrl: './list-documento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListDocumentoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe((_) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `DocumentoCustomer/GetAll/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditDocumentoComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`documentocustomer/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
