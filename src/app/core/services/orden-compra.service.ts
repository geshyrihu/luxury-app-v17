import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class OrdenCompraService {
  private dataService = inject(DataService);

  subRef$: Subscription;

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

    this.subRef$ = this.dataService
      .get(`OrdenCompraDetalle/GetAllTotal/${ordenCompraId}`)
      .subscribe({
        next: (resp: any) => {
          for (let n of resp.body) {
            this.totalOrdenCompra += n.total;
          }

          this.subRef$ = this.dataService
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
              error: (err) => {
                console.log(err.error);
              },
            });
        },
        error: (err) => {
          console.log(err.error);
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
