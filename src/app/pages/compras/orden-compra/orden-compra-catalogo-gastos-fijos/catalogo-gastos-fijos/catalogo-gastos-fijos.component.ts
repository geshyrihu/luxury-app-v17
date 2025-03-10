import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CatalogoGastosFijosService } from 'src/app/core/services/catalogo-gastos-fijos.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ModalOrdenCompraGrastosFijosComponent from '../modal-orden-compra-gastos-fijos/modal-orden-compra-grastos-fijos.component';

const date = new Date();

@Component({
    selector: 'app-catalogo-gastos-fijos',
    templateUrl: './catalogo-gastos-fijos.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class CatalogoGastosFijosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  catalogoGastosFijosService = inject(CatalogoGastosFijosService);

  data: any = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  fechaSolicitud: string = '';

  ngOnInit(): void {
    flatpickrFactory();
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.fechaSolicitud = date.toISOString().slice(0, 10);
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = 'CatalogoGastosFijos/GetAll/' + this.customerIdS.customerId;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`catalogogastosfijos/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModal(data: any) {
    this.catalogoGastosFijosService.setCatalogoGastosFijosId(data.id);

    this.dialogHandlerS
      .openDialog(
        ModalOrdenCompraGrastosFijosComponent,
        {
          title: data.title,
        },
        '',
        this.dialogHandlerS.dialogSizeFull
      )
      .then(() => {
        // TODO: REVISAR PORQUE NO LLEGA SEÑAL Y SE RECARGA
        this.onLoadData();
      });
  }

  crearOrder(id: number, value: any) {
    const urlApi = `CatalogoGastosFijos/ValidarCreateOrder/${id}/${value}`;
    this.apiRequestS.onGetList(urlApi).then(() => {});
  }

  createOrdenesCompra() {
    const urlApi = `OrdenCompra/GenerarOrdenCompraFijos/${this.fechaSolicitud}/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {});
  }
}
