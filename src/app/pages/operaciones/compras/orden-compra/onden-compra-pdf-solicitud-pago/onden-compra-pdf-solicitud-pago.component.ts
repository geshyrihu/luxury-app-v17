import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import ComponentsModule from 'src/app/shared/components.module';
@Component({
  selector: 'app-onden-compra-pdf-solicitud-pago',
  templateUrl: './onden-compra-pdf-solicitud-pago.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, ComponentsModule],
  providers: [MessageService, CustomToastService],
})
export default class OndenCompraPdfSolicitudPagoComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public routeActive = inject(ActivatedRoute);
  public selectItemService = inject(SelectItemService);
  public messageService = inject(MessageService);

  subRef$: Subscription;

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

    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_unidadMedida = resp;
      });
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`OrdenCompra/SolicitudPago/${this.ordenCompraId}`)
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
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
