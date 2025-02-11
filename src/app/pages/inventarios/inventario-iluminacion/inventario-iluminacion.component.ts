import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditInventarioIluminacionComponent from './addoredit-inventario-iluminacion.component';

@Component({
  selector: 'app-inventario-iluminacion',
  templateUrl: './inventario-iluminacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class InventarioIluminacionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  dialogS = inject(DialogService);

  data: any[] = [];

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        'InventarioIluminacion/GetAll/' + this.customerIdS.getCustomerId()
      )
      .then((result: any) => {
        this.data = result;
      });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`InventarioIluminacion/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddoreditInventarioIluminacionComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
