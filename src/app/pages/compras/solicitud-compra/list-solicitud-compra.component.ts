import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { SolicitudCompraService } from 'src/app/core/services/solicitud-compra.service';

@Component({
  selector: 'app-list-solicitud-compra',
  templateUrl: './list-solicitud-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListSolicitudCompraComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  solicitudCompraService = inject(SolicitudCompraService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  statusCompra: number = this.solicitudCompraService.onGetStatusFiltro();

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();
  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(
        `SolicitudCompra/Solicitudes/${
          this.customerIdS.customerId
        }/${this.solicitudCompraService.onGetStatusFiltro()}`
      )
      .then((responseData: any) => {
        this.data = responseData;
      });
  }

  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`solicitudcompra/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onSolicitudCompra(id: number) {
    this.router.navigateByUrl(`/compras/solicitud-compra/${id}`);
  }

  onSelectStatus(status: any) {
    this.solicitudCompraService.onSetStatusFiltro(status);

    this.onLoadData();
  }
  // ...Crear Orden de compra
  onCreateOrder(id: any) {
    this.router.navigateByUrl(`/compras/orden-compra/${0}/${id}`);
  }
}
