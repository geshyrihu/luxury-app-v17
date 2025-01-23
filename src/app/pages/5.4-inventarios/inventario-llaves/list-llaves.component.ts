import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IInventarioLlave } from 'src/app/core/interfaces/inventario-llave-dto.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FormInventarioLlaveComponent from './form-inventario-llave.component';

@Component({
  selector: 'app-llaves',
  templateUrl: './list-llaves.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListLlavesComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  custIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);

  data: IInventarioLlave[] = [];

  ref: DynamicDialogRef;

  customerId: number;
  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.custIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `InventarioLlave/GetAll/${this.custIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`InventarioLlave/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        FormInventarioLlaveComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
