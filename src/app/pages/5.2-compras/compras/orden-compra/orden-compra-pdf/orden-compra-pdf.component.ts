import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-orden-compra-pdf',
  templateUrl: './orden-compra-pdf.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenCompraPdfComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  routeActive = inject(ActivatedRoute);

  url: string = environment.base_urlImg + 'Administration/customer/';
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
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetItem(`ordencompra/Pdf/${this.ordenCompraId}`)
      .then((result: any) => {
        this.model = result;
        this.ordenCompraDetalle = this.model.ordenCompraDetalle;

        for (let n of this.ordenCompraDetalle) {
          this.total += n.total;
        }
        let subTotal = 0;
        let retencionIva = 0;
        let ivaTotal = 0;

        for (let n of this.model.ordenCompraDetalle) {
          subTotal += n.subTotal;
          if (n.unidadMedidaId === 14) {
            retencionIva += n.subTotal;
          }
        }
        for (let n of this.model.ordenCompraDetalle) {
          ivaTotal += n.iva;
        }

        this.retencionIva = retencionIva * 0.06;

        this.subtotal = subTotal;
        this.iva = ivaTotal;

        this.subtotal = subTotal;

        this.total = this.subtotal + this.iva - this.retencionIva;
      });
  }

  onGetOrdenCompraPresupuesto() {
    const urlApi = `OrdenCompraPresupuesto/GetAllForOrdenCompra/${this.ordenCompraId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.ordenCompraPresupuesto = result;
    });
  }
}
