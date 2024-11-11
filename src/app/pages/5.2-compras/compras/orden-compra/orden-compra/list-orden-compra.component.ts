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
import CaratulaFondeoComponent from '../../caratula-fondeo/caratula-fondeo.component';
import CreateOrdenCompraComponent from './create-orden-compra/create-orden-compra.component';
import OrdenCompraComponent from './orden-compra.component';

@Component({
  selector: 'app-list-orden-compra',
  templateUrl: './list-orden-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListOrdenCompraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);
  customerIdService = inject(CustomerIdService);
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

    const url = `OrdenCompra/GetAll/${this.customerIdService.customerId}/${this.statusCompra}`;
    this.apiRequestService.onGetList(url).then((result: any) => {
      this.data = result;
    });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`ordencompra/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
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
  onModalAdd() {
    this.dialogHandlerService
      .openDialog(
        CreateOrdenCompraComponent,
        {},
        'Nueva Orden de compra',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalCaratula() {
    this.dialogHandlerService
      .openDialog(
        CaratulaFondeoComponent,
        {},
        'Caratula',
        this.dialogHandlerService.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onAddOrEdit(id: number) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${id}`);
  }

  onSelectStatus(status: number): void {
    this.ordenCompraService.setStatusCompras(status);
    this.onLoadData();
  }
}
