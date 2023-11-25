import { Injectable } from '@angular/core';
import { IFondeoCaratulaDto } from '../interfaces/IFondeoCaratulaDto.interface';
import { IRequestFondeoCaratulaDto } from '../interfaces/IRequestFondeoCaratulaDto.interface';

@Injectable({
  providedIn: 'root',
})
export class CaratulaFondeoService {
  data: IFondeoCaratulaDto;
  requestFondeoCaratulaDto: IRequestFondeoCaratulaDto;

  getRequestFondeoCaratulaDto() {
    return this.requestFondeoCaratulaDto;
  }

  createRequestFondeoCaratulaDto(item: IRequestFondeoCaratulaDto) {
    this.requestFondeoCaratulaDto = item;
  }
}
