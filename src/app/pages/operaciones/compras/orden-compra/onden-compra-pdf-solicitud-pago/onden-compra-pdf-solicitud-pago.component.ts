import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
@Component({
  selector: 'app-onden-compra-pdf-solicitud-pago',
  templateUrl: './onden-compra-pdf-solicitud-pago.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OndenCompraPdfSolicitudPagoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public routeActive = inject(ActivatedRoute);
  public messageService = inject(MessageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  model: any;
  ordenCompraId: number = 0;
  nombreAutorizador = '';
  total: number = 0;
  ordenCompraPresupuesto: any[] = [];
  ordenCompraDetalle: any[];
  cb_unidadMedida: any[] = [];

  totalOrdenCompra: number = 0;
  subtotal: number = 0;
  retencionIva: number = 0;
  iva: number = 0;

  ngOnInit(): void {
    this.ordenCompraId = this.routeActive.snapshot.params.id;

    this.apiRequestService
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`OrdenCompra/SolicitudPago/${this.ordenCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.model = resp.body;
          if (this.model.ordenCompraAuth.applicationUserAuthId !== null) {
            this.nombreAutorizador = `${this.model.ordenCompraAuth.applicationUserAuth.firstName} ${this.model.ordenCompraAuth.applicationUserAuth.lastName}`;
          }
          if (this.model.ordenCompraDetalle) {
            this.onLoadOrdenCompraDetalle(this.model.ordenCompraDetalle);
          }
          this.ordenCompraPresupuesto =
            this.model.ordenCompraPresupuestoUtilizado;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onLoadOrdenCompraDetalle(ordenCompraDetalle: any[]) {
    for (let n of ordenCompraDetalle) {
      this.total += n.total;
    }

    let subTotal = 0;
    let retencionIva = 0;
    let ivaTotal = 0;
    for (let n of ordenCompraDetalle) {
      subTotal += n.subTotal;
      if (n.unidadMedidaId === 14) {
        retencionIva += n.subTotal;
      }
    }
    for (let n of ordenCompraDetalle) {
      ivaTotal += n.iva;
    }

    this.retencionIva = retencionIva * 0.06;

    this.subtotal = subTotal;
    this.iva = ivaTotal;

    this.subtotal = subTotal;

    this.total = this.subtotal + this.iva - this.retencionIva;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
