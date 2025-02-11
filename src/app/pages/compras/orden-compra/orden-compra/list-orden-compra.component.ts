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
import CreateOrdenCompraComponent from './create-orden-compra/create-orden-compra.component';
import OrdenCompraComponent from './orden-compra.component';

@Component({
    selector: 'app-list-orden-compra',
    templateUrl: './list-orden-compra.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ListOrdenCompraComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];
  ref: DynamicDialogRef;

  statusCompra: number;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.statusCompra = this.ordenCompraService.getStatusCompras();

    const url = `OrdenCompra/GetAll/${this.customerIdS.customerId}/${this.statusCompra}`;
    this.apiRequestS.onGetList(url).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`ordencompra/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onOrdenCompraModal(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS
      .openDialog(
        OrdenCompraComponent,
        {
          id,
        },
        'Editar Orden de Compra',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  onModalAdd() {
    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompraComponent,
        {},
        'Nueva Orden de compra',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onAddOrEdit(id: number) {
    this.router.navigateByUrl(`/compras/orden-compra/${id}`);
  }

  onSelectStatus(status: number): void {
    this.ordenCompraService.setStatusCompras(status);
    this.onLoadData();
  }
}
