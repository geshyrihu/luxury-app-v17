import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';

const fechaActual = new Date();

@Component({
  selector: 'app-orden-compra-presupuesto',
  templateUrl: './orden-compra-presupuesto.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenCompraPresupuestoComponent
  implements OnInit, OnDestroy
{
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  public ordenCompraService = inject(OrdenCompraService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public customerIdService = inject(CustomerIdService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  anio: number = fechaActual.getFullYear();
  data: any[] = [];
  total: number = 0;
  ordenCompraId: number = 0;
  totalConRetencionIva = 0;
  cedulaId: number = 0;
  cb_cedulas: any[] = [];

  ngOnInit(): void {
    this.onLoadCedulasCustomer(this.customerIdService.getcustomerId());
    this.total = this.ordenCompraService.getTotalPorCubrir();
    this.ordenCompraId = this.config.data.ordenCompraId;
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        // `OrdenCompraPresupuesto/GetAll/${this.customerIdService.customerId}/${this.cedulaId}/${this.ordenCompraId}`
        `OrdenCompraPresupuesto/GetAll/${this.cedulaId}/${this.ordenCompraId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.data.forEach(
            (x) => (
              (x.dineroUsado = this.total),
              (x.ordenCompraId = this.ordenCompraId)
            )
          );
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit(partidaPresupuestal: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .post(`OrdenCompraPresupuesto`, partidaPresupuestal)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          const valor =
            this.ordenCompraService.getTotalOrdenCompra() -
            partidaPresupuestal.gastoUsado;
          this.ref.close(true);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
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
    this.dataService
      .get(`CedulaPresupuestal/GetCedulas/${customerId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            this.cedulaId = resp.body[0].value;
            this.onLoadData();
          }

          this.cb_cedulas = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
