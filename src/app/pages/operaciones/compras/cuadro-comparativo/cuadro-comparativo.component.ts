import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import ModalAddProveedorComponent from './modal-add-proveedor/modal-add-proveedor.component';
import ModalEditCotizacionComponent from './modal-edit-cotizacion/modal-edit-cotizacion.component';

@Component({
  selector: 'app-cuadro-comparativo',
  templateUrl: './cuadro-comparativo.component.html',
  standalone: true,
  imports: [FormsModule, ComponentsModule, CommonModule, PrimeNgModule],
  providers: [
    ConfirmationService,
    DialogService,
    MessageService,
    CustomToastService,
  ],
})
export default class CuadroComparativoComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public routeActive = inject(ActivatedRoute);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public confirmationService = inject(ConfirmationService);
  ref: DynamicDialogRef;
  subRef$: Subscription;

  solicitudCompra: any;
  solicitudCompraDetalle: any[];
  cotizacionProveedor: any[] = [];

  provider1: any;
  provider2: any;
  provider3: any;

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
    this.ref = this.dialogService.open(ModalAddProveedorComponent, {
      data: {
        solicitudCompraId: this.solicitudCompraId,
      },
      header: 'Selecciona un proveedor',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.onResetTotal();
        this.onLoadData();
      }
      this.onResetTotal();
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.onResetProvider();
    this.subRef$ = this.dataService
      .get<any>(`SolicitudCompra/CuadroComparativo/${this.solicitudCompraId}`)
      .subscribe({
        next: (resp: any) => {
          this.folio = resp.body.folio;
          this.solicitudCompra = resp.body;
          this.cotizacionProveedor = this.solicitudCompra.cotizacionProveedor;
          this.solicitudCompraDetalle =
            this.solicitudCompra.solicitudCompraDetalle;

          if (this.cotizacionProveedor.length === 1) {
            this.provider1 = this.cotizacionProveedor[0].provider;
            for (let n of this.solicitudCompraDetalle) {
              this.total1 += n.total;
            }
          }
          if (this.cotizacionProveedor.length === 2) {
            this.provider1 = this.cotizacionProveedor[0].provider;
            this.provider2 = this.cotizacionProveedor[1].provider;
            for (let n of this.solicitudCompraDetalle) {
              this.total1 += n.total;
            }
            for (let n of this.solicitudCompraDetalle) {
              this.total2 += n.total2;
            }
          }
          if (this.cotizacionProveedor.length === 3) {
            this.provider1 = this.cotizacionProveedor[0].provider;

            this.provider2 = this.cotizacionProveedor[1].provider;

            this.provider3 = this.cotizacionProveedor[2].provider;

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
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onEditCotizacion(posicionCotizacion: number) {
    this.ref = this.dialogService.open(ModalEditCotizacionComponent, {
      data: {
        solicitudCompraId: this.solicitudCompraId,
        posicionCotizacion: posicionCotizacion,
      },
      width: '90%',
      header: 'Editar Cotización',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe(() => {
      this.customToastService.onShowSuccess();
      this.onResetTotal();
      this.onLoadData();
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
