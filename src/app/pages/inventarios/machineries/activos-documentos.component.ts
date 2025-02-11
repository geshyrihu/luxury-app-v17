import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import SubirPdfComponent from 'src/app/shared/subir-pdf/subir-pdf.component';

@Component({
    selector: 'app-activos-documentos',
    templateUrl: './activos-documentos.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class ActivosDocumentosComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);

  data: any[] = [];
  machineryId: number = 0;
  url: string = '';

  ngOnInit(): void {
    this.machineryId = this.config.data.machineryId;
    if (this.machineryId !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MachineryDocument/GetAll/${this.machineryId}`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`Machineries/DeleteDocument/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }
  onModalFormUploadDoc(id: number) {
    this.dialogHandlerS
      .openDialog(
        SubirPdfComponent,
        {
          serviceOrderId: id,
          pathUrl: 'Machineries/SubirDocumento/',
        },
        'Cargar Documentos',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
}
