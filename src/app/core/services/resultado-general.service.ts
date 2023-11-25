import { EventEmitter, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ResultadoGeneralService {
  dataGrafico: any;

  dataGrafico$ = new EventEmitter<any>();

  onSetDataGraficos(data) {
    this.dataGrafico = data;
  }
}
