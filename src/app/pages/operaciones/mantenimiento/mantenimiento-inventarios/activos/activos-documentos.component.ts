import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import SubirPdfComponent from 'src/app/shared/subir-pdf/subir-pdf.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activos-documentos',
  templateUrl: './activos-documentos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ActivosDocumentosComponent {
  customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  machineryId: number = 0;
  url: string = '';

  onLoadData() {
    this.url = `${
      environment.base_urlImg
    }customers/${this.customerIdService.getcustomerId()}/machinery/`;
    this.machineryId = this.config.data.machineryId;
    if (this.machineryId !== 0) this.onLoadData();
    this.dataService
      .get(`MachineryDocument/GetAll/${this.machineryId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
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
    this.ref = this.dialogService.open(SubirPdfComponent, {
      data: {
        serviceOrderId: id,
        pathUrl: 'Machineries/SubirDocumento/',
      },
      header: 'Cargar Imagenes',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
