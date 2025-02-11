import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { IUpdateDescription } from 'src/app/core/interfaces/update-description.interface';
import { IUploadEvent } from 'src/app/core/interfaces/upload-event.interfase';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-presupuesto-edition-file',
  templateUrl: './presupuesto-edition-file.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FileUploadModule],
})
export default class PresupuestoEditionFileComponent implements OnInit {
  customToastService = inject(CustomToastService);
  config = inject(DynamicDialogConfig);
  apiRequestS = inject(ApiRequestService);

  id = this.config.data.id;
  url: string = `${environment.API_BASE_URL}Cuentas/SetDocuments/${this.id}`;
  uploadedFiles: any[] = [];
  data: any[] = [];
  description: string = '';

  presupuestoDetalleSoporteId: string = '';
  files: any[] = [];

  ngOnInit(): void {
    this.onGetDescription();
    this.onGetFiles();
  }
  onUpload(event: IUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.onGetFiles();
  }

  onGetDescription() {
    this.apiRequestS
      .onGetItem(`Cuentas/Description/${this.id}`)
      .then((responseData: any) => {
        this.description = responseData.description;
        this.presupuestoDetalleSoporteId = responseData.id;
      });
  }
  onGetFiles() {
    this.apiRequestS
      .onGetList(`Cuentas/SoporteFileList/${this.id}`)
      .then((responseData: any) => {
        this.files = responseData;
      });
  }
  onSetDescription() {
    const data: IUpdateDescription = {
      description: this.description,
      id: this.presupuestoDetalleSoporteId,
    };

    this.apiRequestS.onPut(`Cuentas/UpdateDescription`, data);
  }

  // Función para eliminar un archivo
  onDeleteFile(id: number) {
    this.apiRequestS
      .onDelete(`Cuentas/File/${id}`)
      .then((responseData: boolean) => {
        // if (responseData) this.data = this.data.filter((item) => item.id !== id);
        if (responseData) {
          // Eliminar solo el registro afectado en lugar de toda la lista
          // Supongamos que has recibido la respuesta HTTP y tienes el `id` del archivo a eliminar
          const deleteRecordId = id; // Reemplaza 123 con el ID real del archivo que deseas eliminar
          // Encuentra el índice del registro a eliminar en la lista
          const recordIndex = this.files.findIndex(
            (record) => record.id === deleteRecordId
          );
          if (recordIndex !== -1) {
            // Si se encuentra el registro, elimínalo de la lista
            this.files.splice(recordIndex, 1);
          }
        }
      });
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
  }
}
