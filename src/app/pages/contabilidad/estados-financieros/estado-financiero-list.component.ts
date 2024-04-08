import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddFileEstadoFinancieroComponent from './add-file-estado-financiero/add-file-estado-financiero.component';
@Component({
  selector: 'app-estado-financiero-list',
  templateUrl: './estado-financiero-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EstadoFinancieroListComponent implements OnInit {
  private authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);

  data: any[] = [];
  ref: DynamicDialogRef;
  baseUrlApi = environment.base_urlImg;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData(): void {
    this.apiRequestService
      .onGetList(
        `EstadoFinanciero/ToCustomer/${this.customerIdService.customerId}/`
      )
      .then((result: any) => {
        this.data = result;
      });
  }

  // Función para abrir un cuadro de diálogo modal paraa agregar el archivo
  onUploadFile(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddFileEstadoFinancieroComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onAuthorize(id: string) {
    this.apiRequestService
      .onGetItem(
        `EstadoFinanciero/Authorize/${id}/${this.authService.infoEmployeeDto.personId}`
      )
      .then((_) => {
        this.onLoadData();
      });
  }
  onDesauthorize(id: string) {
    this.apiRequestService
      .onGetItem(`EstadoFinanciero/Desauthorize/${id}`)
      .then((_) => {
        this.onLoadData();
      });
  }

  // onSendEstadosFinancieros(data: any) {
  onSendEstadosFinancieros(data: any) {
    this.apiRequestService
      .onPost(
        `EstadoFinanciero/Send/${data.id}/${this.authService.infoEmployeeDto.personId}`,
        null
      )
      .then((_) => {
        this.onLoadData();
      });
  }
}
