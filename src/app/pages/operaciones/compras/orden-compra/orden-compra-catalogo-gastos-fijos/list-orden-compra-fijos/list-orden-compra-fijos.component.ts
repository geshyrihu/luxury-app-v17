import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';
import CreateOrdenCompraComponent from '../../orden-compra/create-orden-compra/create-orden-compra.component';
import OrdenCompraComponent from '../../orden-compra/orden-compra.component';

@Component({
  selector: 'app-list-orden-compra-fijos',
  templateUrl: './list-orden-compra-fijos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListOrdenCompraFijosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  router = inject(Router);
  customerIdService = inject(CustomerIdService);
  ordenCompraService = inject(OrdenCompraService);

  data: any[] = [];
  ref: DynamicDialogRef;

  statusCompra: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.statusCompra = this.ordenCompraService.getStatusCompras();

    const urlApi = `OrdenCompra/OrdenesCompraGastosFijos/${this.customerIdService.customerId}/${this.statusCompra}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onModalAdd() {
    this.dialogHandlerService
      .openDialog(
        CreateOrdenCompraComponent,
        {},
        'Nueva Orden de compra',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`ordencompra/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onAddOrEdit(id: number) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${id}`);
  }

  selectStatus(status: number): void {
    this.ordenCompraService.setStatusCompras(status);
    this.onLoadData();
  }

  onOrdenCompraModal(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerService
      .openDialog(
        OrdenCompraComponent,
        {
          id,
        },
        'Editar Orden de Compra',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
