import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FichaTecnicaActivoComponent from '../inventarios/machineries/ficha-tecnica-activo.component';

@Component({
    selector: 'app-mi-edificio',
    templateUrl: './mi-edificio.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class MiEdificioComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  markers: any;
  zoom: number = 15;

  ngOnInit(): void {
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const customerId = this.customerIdS.getCustomerId();
    const urlApi = `MiEdificio/Caratula/${customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerS
      .openDialog(
        FichaTecnicaActivoComponent,
        data,
        'Ficha Técnica',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
