import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudCompraService {
  textoFiltro: string = '';
  statusFiltro: number = 2;
  private deleteProduct = new Subject();

  deleteProduct$ = this.deleteProduct.asObservable();

  onDeleteProduct() {
    this.deleteProduct.next('');
  }

  onSetTextoFiltro(texto: string) {
    this.textoFiltro = texto;
  }

  onGetTextoFiltro(): string {
    return this.textoFiltro;
  }
  onSetStatusFiltro(statusFiltro: number) {
    this.statusFiltro = statusFiltro;
  }

  onGetStatusFiltro(): number {
    return this.statusFiltro;
  }
}
