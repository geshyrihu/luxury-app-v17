import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
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
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CatalogoGastosFijosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  catalogoGastosFijosService = inject(CatalogoGastosFijosService);

  data: any = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  fechaSolicitud: string = '';

  ngOnInit(): void {
    flatpickrFactory();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.fechaSolicitud = date.toISOString().slice(0, 10);
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi =
      'CatalogoGastosFijos/GetAll/' + this.customerIdService.customerId;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`catalogogastosfijos/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModal(data: any) {
    this.catalogoGastosFijosService.setCatalogoGastosFijosId(data.id);

    this.dialogHandlerService
      .openDialog(
        ModalOrdenCompraGrastosFijosComponent,
        {
          title: data.title,
        },
        '',
        this.dialogHandlerService.dialogSizeFull
      )
      .then(() => {
        // TODO: REVISAR PORQUE NO LLEGA SEÑAL Y SE RECARGA
        this.onLoadData();
      });
  }

  crearOrder(id: number, value: any) {
    const urlApi = `CatalogoGastosFijos/ValidarCreateOrder/${id}/${value}`;
    this.apiRequestService.onGetList(urlApi).then(() => {});
  }

  createOrdenesCompra() {
    const urlApi = `OrdenCompra/GenerarOrdenCompraFijos/${this.fechaSolicitud}/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {});
  }
}
