import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import ModalAddProveedorComponent from './modal-add-proveedor/modal-add-proveedor.component';
import ModalEditCotizacionComponent from './modal-edit-cotizacion/modal-edit-cotizacion.component';

@Component({
  selector: 'app-cuadro-comparativo',
  templateUrl: './cuadro-comparativo.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CuadroComparativoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customToastService = inject(CustomToastService);
  routeActive = inject(ActivatedRoute);

  ref: DynamicDialogRef;

  solicitudCompra: any;
  solicitudCompraDetalle: any[];
  cotizacionProveedor: any[] = [];

  provider1: any;
  provider2: any;
  provider3: any;

  cotizacionProveedorId1: any;
  cotizacionProveedorId2: any;
  cotizacionProveedorId3: any;

  total1 = 0;
  total2 = 0;
  total3 = 0;

  amarilloTotal1 = false;
  amarilloTotal2 = false;
  amarilloTotal3 = false;

  solicitudCompraId: number;
  folio = '';

  constructor() {
    this.routeActive.params.subscribe((resp) => {
      this.solicitudCompraId = resp['id'];
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onModalAddProveedor() {
    this.dialogHandlerService
      .openDialog(
        ModalAddProveedorComponent,
        {
          solicitudCompraId: this.solicitudCompraId,
        },
        'Selecciona un proveedor',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onResetTotal();
          this.onLoadData();
        }
      });
  }
  onLoadData() {
    this.cotizacionProveedor = [];
    this.solicitudCompraDetalle = [];
    this.provider1 = undefined;
    this.provider2 = undefined;
    this.provider3 = undefined;
    const urlApi = `solicitudcompra/cuadrocomparativo/${this.solicitudCompraId}`;

    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      console.log('🚀 ~ result:', result);
      this.folio = result.folio;
      this.solicitudCompra = result;
      this.cotizacionProveedor = this.solicitudCompra.cotizacionProveedor;
      this.solicitudCompraDetalle = this.solicitudCompra.solicitudCompraDetalle;

      if (this.cotizacionProveedor.length === 1) {
        this.provider1 = this.cotizacionProveedor[0].nameProvider;
        for (let n of this.solicitudCompraDetalle) {
          this.total1 += n.total;
        }
      }
      if (this.cotizacionProveedor.length === 2) {
        this.provider1 = this.cotizacionProveedor[0].nameProvider;
        this.provider2 = this.cotizacionProveedor[1].nameProvider;
        for (let n of this.solicitudCompraDetalle) {
          this.total1 += n.total;
        }
        for (let n of this.solicitudCompraDetalle) {
          this.total2 += n.total2;
        }
      }
      if (this.cotizacionProveedor.length === 3) {
        this.provider1 = this.cotizacionProveedor[0].nameProvider;
        this.cotizacionProveedorId1 = this.cotizacionProveedor[0].id;

        this.provider2 = this.cotizacionProveedor[1].nameProvider;
        this.cotizacionProveedorId2 = this.cotizacionProveedor[1].id;

        this.provider3 = this.cotizacionProveedor[2].nameProvider;
        this.cotizacionProveedorId3 = this.cotizacionProveedor[2].id;

        for (let n of this.solicitudCompraDetalle) {
          this.total1 += n.total;
        }
        for (let n of this.solicitudCompraDetalle) {
          this.total2 += n.total2;
        }
        for (let n of this.solicitudCompraDetalle) {
          this.total3 += n.total3;
        }
      }
      this.onEvaluationPriceTotal();
      this.ontotalPreciosMenores(this.solicitudCompraDetalle);
    });
  }

  onEditCotizacion(posicionCotizacion: number, cotizacionProveedorId: number) {
    this.dialogHandlerService
      .openDialog(
        ModalEditCotizacionComponent,
        {
          solicitudCompraId: this.solicitudCompraId,
          posicionCotizacion: posicionCotizacion,
          cotizacionProveedorId: cotizacionProveedorId,
        },
        'Editar Cotización',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onResetTotal();
          this.onLoadData();
        }
      });
  }

  onResetProvider(): void {
    this.provider1 = undefined;
    this.provider2 = undefined;
    this.provider3 = undefined;
  }
  onResetTotal() {
    this.total1 = 0;
    this.total2 = 0;
    this.total3 = 0;
  }

  onEvaluationPriceTotal(): void {
    this.amarilloTotal1 = false;
    this.amarilloTotal2 = false;
    this.amarilloTotal3 = false;
    this.onMejorOpcion1();
    this.onMejorOpcion2();
    this.onMejorOpcion3();
  }

  onMejorOpcion1(): void {
    if (
      this.total1 !== 0 &&
      this.solicitudCompra.cotizacionProveedor.length === 3
    ) {
      if (this.total3 === 0) {
        if (this.total2 > this.total1) {
          this.amarilloTotal1 = true;
        }
      } else if (this.total2 === 0) {
        if (this.total3 > this.total1) {
          this.amarilloTotal1 = true;
        }
      } else if (this.total3 !== 0) {
        if (this.total2 > this.total1 && this.total3 > this.total1) {
          this.amarilloTotal1 = true;
        }
      }
    }
    if (
      this.total1 !== 0 &&
      this.solicitudCompra.cotizacionProveedor.length === 2
    ) {
      if (this.total2 > this.total1) {
        this.amarilloTotal1 = true;
      }
    }
  }
  onMejorOpcion2(): void {
    if (
      this.total2 !== 0 &&
      this.solicitudCompra.cotizacionProveedor.length === 3
    ) {
      if (this.total3 === 0) {
        if (this.total1 > this.total2) {
          this.amarilloTotal2 = true;
        }
      } else if (this.total1 === 0) {
        if (this.total3 > this.total2) {
          this.amarilloTotal2 = true;
        }
      } else if (this.total3 !== 0 && this.total1 !== 0) {
        if (this.total2 < this.total1 && this.total2 < this.total3) {
          this.amarilloTotal2 = true;
        }
      }
    }
    if (this.total2 !== 0) {
      if (this.total3 === 0) {
        if (this.total1 > this.total2) {
          this.amarilloTotal2 = true;
        }
      } else if (this.total1 === 0) {
        if (this.total3 > this.total2) {
          this.amarilloTotal2 = true;
        }
      } else if (this.total3 !== 0 && this.total1 !== 0) {
        if (this.total2 < this.total1 && this.total2 < this.total3) {
          this.amarilloTotal2 = true;
        }
      }
    }
    if (
      this.total2 !== 0 &&
      this.solicitudCompra.cotizacionProveedor.length === 2
    ) {
      if (this.total1 > this.total2) {
        this.amarilloTotal2 = true;
      }
    }
  }
  onMejorOpcion3(): void {
    if (this.total3 !== 0) {
      if (this.total1 === 0) {
        if (this.total2 > this.total3) {
          this.amarilloTotal3 = true;
        }
      } else if (this.total2 === 0) {
        if (this.total1 > this.total3) {
          this.amarilloTotal3 = true;
        }
      } else if (this.total1 !== 0 && this.total2 !== 0) {
        if (this.total3 < this.total1 && this.total3 < this.total2) {
          this.amarilloTotal3 = true;
        }
      }
    }
  }

  mejorPrecioTotal1: number = 0;
  mejorPrecioTotal2: number = 0;
  mejorPrecioTotal3: number = 0;
  totalMejorPrecioTotal: number = 0;
  evaluarPrecioIndependiente = false;

  ontotalPreciosMenores(solicitudCompraDetalle: any[]): void {
    this.onResetMejorPrecio();
    if (this.solicitudCompra.cotizacionProveedor.length === 3) {
      for (let n of solicitudCompraDetalle) {
        if (n.total < n.total2 && n.total < n.total3) {
          this.mejorPrecioTotal1 += n.total;
        }
      }
      for (let n of solicitudCompraDetalle) {
        if (n.total2 < n.total && n.total2 < n.total3) {
          this.mejorPrecioTotal2 += n.total2;
        }
      }
      for (let n of solicitudCompraDetalle) {
        if (n.total3 < n.total && n.total3 < n.total2) {
          this.mejorPrecioTotal3 += n.total3;
        }
      }
      this.totalMejorPrecioTotal =
        this.mejorPrecioTotal1 +
        this.mejorPrecioTotal2 +
        this.mejorPrecioTotal3;
    }
    if (this.solicitudCompra.cotizacionProveedor.length === 2) {
      for (let n of solicitudCompraDetalle) {
        if (n.total < n.total2) {
          this.mejorPrecioTotal1 += n.total;
        }
      }
      for (let n of solicitudCompraDetalle) {
        if (n.total2 < n.total) {
          this.mejorPrecioTotal2 += n.total2;
        }
      }

      this.totalMejorPrecioTotal =
        this.mejorPrecioTotal1 + this.mejorPrecioTotal2;
    }
  }

  onResetMejorPrecio() {
    this.mejorPrecioTotal1 = 0;
    this.mejorPrecioTotal2 = 0;
    this.mejorPrecioTotal3 = 0;
    this.totalMejorPrecioTotal = 0;
  }
}
