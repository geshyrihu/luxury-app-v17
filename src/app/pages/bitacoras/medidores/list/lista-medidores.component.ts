import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import * as FileSaver from 'file-saver';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IMedidor } from 'src/app/core/interfaces/medidor.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import FormMedidorLecturaComponent from '../lecturas/form-medidor-lectura.component';
import FormMedidorComponent from './form-medidor.component';

@Component({
  selector: 'app-lista-medidores',
  templateUrl: './lista-medidores.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMedidorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  data: IMedidor[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `Medidor/GetAll/${this.customerIdS.customerId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestS.onDelete(`Medidor/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  modalAddEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        FormMedidorComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  modalMedidorLecturaAddEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        FormMedidorLecturaComponent,
        {
          medidorId: data.id,
          id: 0,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  datosExcel: any[] = [];
  exportExcel(id: number) {
    const urlApi = `MedidorLectura/ExportExcel/${id}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.datosExcel = result;
      this.generate();
    });
  }

  generate() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.datosExcel);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'lecturas');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION, { autoBom: false });
  }
}
