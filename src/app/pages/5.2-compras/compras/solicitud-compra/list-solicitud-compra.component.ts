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
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  router = inject(Router);
  solicitudCompraService = inject(SolicitudCompraService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  statusCompra: number = this.solicitudCompraService.onGetStatusFiltro();

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.apiRequestService
      .onGetList(
        `SolicitudCompra/Solicitudes/${
          this.customerIdService.customerId
        }/${this.solicitudCompraService.onGetStatusFiltro()}`
      )
      .then((result: any) => {
        this.data = result;
      });
  }

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`solicitudcompra/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onSolicitudCompra(id: number) {
    this.router.navigateByUrl(`operaciones/compras/solicitud-compra/${id}`);
  }

  onSelectStatus(status: any) {
    this.solicitudCompraService.onSetStatusFiltro(status);

    this.onLoadData();
  }
  // ...Crear Orden de compra
  onCreateOrder(id: any) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${0}/${id}`);
  }
}
