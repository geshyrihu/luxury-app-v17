import { Injectable } from '@angular/core';
import { IFondeoCaratula } from '../interfaces/fondeo-caratula.interface';
import { IRequestFondeoCaratula } from '../interfaces/request-fondeo-caratula.interface';

@Injectable({
  providedIn: 'root',
})
export class CaratulaFondeoService {
  data: IFondeoCaratula;
  requestFondeoCaratulaDto: IRequestFondeoCaratula;

  getRequestFondeoCaratulaDto() {
    return this.requestFondeoCaratulaDto;
  }

  createRequestFondeoCaratulaDto(item: IRequestFondeoCaratula) {
    this.requestFondeoCaratulaDto = item;
  }
}
