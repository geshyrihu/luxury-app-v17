import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomerIdService,
} from 'src/app/core/services/common-services';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddoreditInventarioIluminacionComponent from './addoredit-inventario-iluminacion.component';
@Component({
  selector: 'app-inventario-iluminacion',
  templateUrl: './inventario-iluminacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class InventarioIluminacionComponent implements OnInit {
  public apiRequestService = inject(ApiRequestService);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dialogHandlerService = inject(DialogHandlerService);
  public dialogService = inject(DialogService);

  urlImg = environment.base_urlImg + 'Administration/products/';
  data: any[] = [];

  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  url = `${environment.base_urlImg}Administration/products/`;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        'InventarioIluminacion/GetAll/' + this.customerIdService.getcustomerId()
      )
      .then((result: any) => {
        this.data = result;
      });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`InventarioIluminacion/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditInventarioIluminacionComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
