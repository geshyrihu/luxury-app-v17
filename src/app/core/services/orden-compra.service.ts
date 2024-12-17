import { Injectable, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataConnectorService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class OrdenCompraService implements OnDestroy {
  dataService = inject(DataConnectorService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ordenCompraId: number = 0;

  totalOrdenCompra: number = 0;
  totalCubierto: number = 0;
  totalPorCubrir: number = 0;

  statusCompras: number = 2;

  getOrdenCompraId() {
    return this.ordenCompraId;
  }

  setOrdenCompraId(ordenCompraId: number) {
    this.ordenCompraId = ordenCompraId;
  }

  getTotalOrdenCompra(): number {
    return this.totalOrdenCompra;
  }
  getTotalCubierto(): number {
    return this.totalCubierto;
  }
  getTotalPorCubrir(): number {
    return this.totalPorCubrir;
  }

  actualizarTotalOrdenCompra(ordenCompraId: number) {
    this.totalOrdenCompra = 0;
    this.totalCubierto = 0;
    this.totalPorCubrir = 0;

    this.dataService
      .get(`OrdenCompraDetalle/GetAllTotal/${ordenCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          for (let n of resp.body) {
            this.totalOrdenCompra += n.total;
          }

          this.dataService
            .get(
              `OrdenCompraPresupuesto/GetAllForOrdenCompraTotal/${ordenCompraId}`
            )
            .subscribe({
              next: (resp: any) => {
                for (let n of resp.body) {
                  this.totalCubierto += n.dineroUsado;
                }

                this.totalPorCubrir =
                  Math.round(
                    (this.totalOrdenCompra - this.totalCubierto) * 100
                  ) / 100;
              },
              error: (error) => {
                console.log(error.error);
              },
            });
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  //... Estatus de compras

  setStatusCompras(statusCompras: number): void {
    this.statusCompras = statusCompras;
  }

  getStatusCompras(): number {
    return this.statusCompras;
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
