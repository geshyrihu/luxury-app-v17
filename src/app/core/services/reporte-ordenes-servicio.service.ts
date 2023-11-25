import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReporteOrdenesServicioService {
  data: any[] = [0];
  date: Date;
  dateGrafico: any[] = [];

  setData(data) {
    this.data = [];
    this.data = data;
  }
  getData(): any[] {
    return this.data;
  }
  setDateGrafico(dateGrafico) {
    this.dateGrafico = dateGrafico;
  }
  getDateGrafico(): any[] {
    return this.dateGrafico;
  }
  setDate(date) {
    this.date = date;
  }
  getDate(): Date {
    return this.date;
  }
}
