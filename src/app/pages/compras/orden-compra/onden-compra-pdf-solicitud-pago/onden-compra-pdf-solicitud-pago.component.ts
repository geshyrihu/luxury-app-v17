import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-onden-compra-pdf-solicitud-pago',
  templateUrl: './onden-compra-pdf-solicitud-pago.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OndenCompraPdfSolicitudPagoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  routeActive = inject(ActivatedRoute);

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

    this.apiRequestS
      .onGetSelectItem('getMeasurementUnits')
      .then((response: any) => {
        this.cb_unidadMedida = response;
      });
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`OrdenCompra/SolicitudPago/${this.ordenCompraId}`)
      .then((response: any) => {
        this.model = response;
        if (this.model.ordenCompraAuth.applicationUserAuthId !== null) {
          this.nombreAutorizador = `${this.model.ordenCompraAuth.applicationUserAuth.firstName} ${this.model.ordenCompraAuth.applicationUserAuth.lastName}`;
        }
        if (this.model.ordenCompraDetalle) {
          this.onLoadOrdenCompraDetalle(this.model.ordenCompraDetalle);
        }
        this.ordenCompraPresupuesto =
          this.model.ordenCompraPresupuestoUtilizado;
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
}
