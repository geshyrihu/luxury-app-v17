import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';

const fechaActual = new Date();

@Component({
    selector: 'app-orden-compra-presupuesto',
    templateUrl: './orden-compra-presupuesto.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class OrdenCompraPresupuestoComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  ordenCompraService = inject(OrdenCompraService);
  ref = inject(DynamicDialogRef);

  anio: number = fechaActual.getFullYear();
  data: any[] = [];
  total: number = 0;
  ordenCompraId: number = 0;
  totalConRetencionIva = 0;
  cedulaId: number = 0;
  cb_cedulas: any[] = [];

  submitting: boolean = false;

  ngOnInit(): void {
    this.onLoadCedulasCustomer(this.customerIdS.getCustomerId());
    this.total = this.ordenCompraService.getTotalPorCubrir();
    this.ordenCompraId = this.config.data.ordenCompraId;
  }
  onLoadData() {
    const urlApi = `OrdenCompraPresupuesto/GetAll/${this.cedulaId}/${this.ordenCompraId}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
      this.data.forEach(
        (x) => (
          (x.dineroUsado = this.total), (x.ordenCompraId = this.ordenCompraId)
        )
      );
    });
  }
  onSubmit(partidaPresupuestal: any) {
    this.submitting = true;

    this.apiRequestS
      .onPost(`OrdenCompraPresupuesto`, partidaPresupuestal)
      .then((responseData: boolean) => {
        const valor =
          this.ordenCompraService.getTotalOrdenCompra() -
          partidaPresupuestal.gastoUsado;
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }
  actualizarAnio() {
    const anioString = String(this.anio);
    if (anioString.length === 4) {
      this.onLoadData();
    } else {
      return;
    }
  }

  onLoadCedulasCustomer(customerId: number) {
    const urlApi = `CedulaPresupuestal/GetCedulas/${customerId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      if (responseData) {
        this.cedulaId = responseData[0].value;
        this.onLoadData();
      }

      this.cb_cedulas = responseData;
    });
  }
}
