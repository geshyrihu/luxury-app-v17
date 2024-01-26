import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  OrdenCompraService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';

const fechaActual = new Date();

@Component({
  selector: 'app-orden-compra-presupuesto',
  templateUrl: './orden-compra-presupuesto.component.html',
  standalone: true,
  imports: [ComponentsModule, FormsModule, CommonModule, PrimeNgModule],
  providers: [MessageService, CustomToastService],
})
export default class OrdenCompraPresupuestoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public authService = inject(AuthService);
  public ordenCompraService = inject(OrdenCompraService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
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
