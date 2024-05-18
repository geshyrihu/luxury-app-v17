import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import SubirPdfComponent from 'src/app/shared/subir-pdf/subir-pdf.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activos-documentos',
  templateUrl: './activos-documentos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ActivosDocumentosComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdService = inject(CustomerIdService);

  data: any[] = [];
  machineryId: number = 0;
  url: string = '';

  ngOnInit(): void {
    this.url = `${
      environment.base_urlImg
    }customers/${this.customerIdService.getCustomerId()}/machinery/`;
    this.machineryId = this.config.data.machineryId;
    if (this.machineryId !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MachineryDocument/GetAll/${this.machineryId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Machineries/DeleteDocument/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
  onModalFormUploadDoc(id: number) {
    this.dialogHandlerService
      .openDialog(
        SubirPdfComponent,
        {
          serviceOrderId: id,
          pathUrl: 'Machineries/SubirDocumento/',
        },
        'Cargar Imagenes',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
