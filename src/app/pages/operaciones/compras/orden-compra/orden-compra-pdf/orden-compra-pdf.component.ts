import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-orden-compra-pdf',
  templateUrl: './orden-compra-pdf.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenCompraPdfComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public routeActive = inject(ActivatedRoute);

  public messageService = inject(MessageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`ordencompra/Pdf/${this.ordenCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.model = resp.body;
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
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onGetOrdenCompraPresupuesto() {
    this.dataService
      .get<any>(
        `OrdenCompraPresupuesto/GetAllForOrdenCompra/${this.ordenCompraId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.ordenCompraPresupuesto = resp.body;
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
