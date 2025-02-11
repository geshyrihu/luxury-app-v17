import { Component, inject, OnInit } from '@angular/core';
import { FlatpickrModule } from 'angularx-flatpickr';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-inspection-report-list',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FlatpickrModule],
  templateUrl: './inspection-report-list.component.html',
})
export default class InspectionReportListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  constructor() {
    flatpickrFactory();
  }
  // Declaración e inicialización de variables
  data: any = null;

  inspectionResultId: string = '';
  inspectionResult: ISelectItem[] = [];
  date: string = '';

  ngOnInit(): void {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // Ajuste de zona horaria
    this.date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.onLoadInspectionReport();
  }
  onDateChange(value: any) {
    this.onLoadData(this.inspectionResultId, value);
  }
  onLoadData(inspectionResultId: string, date: string): void {
    const urlApi = `InspectionResult/Report/${inspectionResultId}/${date}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onReload() {
    this.onLoadData(this.inspectionResultId, this.date);
  }

  onLoadInspectionReport() {
    const urlApi = `CustomerInspections/${this.customerIdService.getCustomerId()}`;
    this.apiRequestS.onGetSelectItem(urlApi).then((responseData: any) => {
      this.inspectionResult = responseData;
    });
  }

  onExportPDF() {
    const urlApi = `InspectionResult/ExportPDF/${this.inspectionResultId}/${this.date}`;
    const nameDocument = `Inspección_${this.inspectionResultId}.pdf`; // Nombre del archivo

    this.apiRequestS.onDownloadFile(urlApi, nameDocument);
  }
}
