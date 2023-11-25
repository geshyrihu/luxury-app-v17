import { Injectable } from '@angular/core';
import { IFilterTicket } from 'src/app/core/interfaces/IFilterTicket.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  data: any[] = [];
  dateGrafico: any[] = [];
  customerId: number;
  operationReportfFilter: IFilterTicket;
  minutaId: number = 0;

  dataReport: any[] = [];

  
  getCustomerId() {
    return this.customerId;
  }
  setCustomerId(id: number) {
    this.customerId = id;
  }
  getDataOperationReport() {
    return this.operationReportfFilter;
  }
  setDataOperationReport(model: IFilterTicket) {
    this.operationReportfFilter = model;
  }
  setDataGrafico(model: any) {
    this.dateGrafico = model;
  }

  setIdMinuta(id: number) {
    this.minutaId = id;
  }
  getIdMinuta() {
    return this.minutaId;
  }
  getDateGrafico() {
    return this.dateGrafico;
  }
}
