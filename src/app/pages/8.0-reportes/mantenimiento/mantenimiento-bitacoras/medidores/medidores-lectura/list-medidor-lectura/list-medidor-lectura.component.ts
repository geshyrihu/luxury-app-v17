import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import * as FileSaver from 'file-saver';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AdminFormMedidorLecturaComponent from '../admin-form-medidor-lectura/admin-form-medidor-lectura.component';
import FormMedidorLecturaComponent from '../form-medidor-lectura/form-medidor-lectura.component';
@Component({
  selector: 'app-list-medidor-lectura',
  templateUrl: './list-medidor-lectura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListMedidorLecturaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  route = inject(ActivatedRoute);

  data: any[] = [];
  ref: DynamicDialogRef;

  medidorId: number = 0;
  constructor() {
    this.medidorId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `MedidorLectura/GetAll/${this.medidorId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
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
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`MedidorLectura/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  modalAddEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AdminFormMedidorLecturaComponent,
        {
          id: data.id,
          medidorId: this.medidorId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  modalMedidorLecturaAddEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        FormMedidorLecturaComponent,
        {
          medidorId: data.id,
          id: 0,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
  ];
  numeros = [65, 59, 80, 81, 56, 55, 40, 36, 95, 85];
}
