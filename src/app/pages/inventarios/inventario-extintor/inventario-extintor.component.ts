import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ImageModule } from 'primeng/image';
import { Observable } from 'rxjs';
import { IInventarioExtintor } from 'src/app/core/interfaces/inventario-extintor.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditInventarioExtintorComponent from './addoredit-inventario-extintor.component';

@Component({
    selector: 'app-inventario-extintor',
    templateUrl: './inventario-extintor.component.html',
    imports: [LuxuryAppComponentsModule, ImageModule]
})
export default class InventarioExtintorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);

  data: IInventarioExtintor[] = [];
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi =
      'InventarioExtintor/GetAll/' + this.customerIdS.getCustomerId();
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`InventarioExtintor/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditInventarioExtintorComponent,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
