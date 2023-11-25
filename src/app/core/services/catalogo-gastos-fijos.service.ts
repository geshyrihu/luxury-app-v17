import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CatalogoGastosFijosService {
  catalogoGastosFijosId: number = 0;

  setCatalogoGastosFijosId(catalogoGastosFijosId: number) {
    this.catalogoGastosFijosId = catalogoGastosFijosId;
  }

  getCatalogoGastosFijosId(): number {
    return this.catalogoGastosFijosId;
  }
}
