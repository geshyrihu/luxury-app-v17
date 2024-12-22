import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FichaTecnicaActivoComponent from '../5.4-inventarios/machineries/ficha-tecnica-activo/ficha-tecnica-activo.component';

@Component({
  selector: 'app-mi-edificio',
  templateUrl: './mi-edificio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class MiEdificioComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);

  data: any;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  markers: any;
  zoom: number = 15;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const customerId = this.customerIdService.getCustomerId();
    const urlApi = `MiEdificio/Caratula/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerService
      .openDialog(
        FichaTecnicaActivoComponent,
        data,
        'Ficha Técnica',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
