import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/common-services';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-presupuesto-edition-file',
  templateUrl: './presupuesto-edition-file.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    ComponentsModule,
    FormsModule,
    PrimeNgModule,
  ],
})
export default class PresupuestoEditionFileComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);

  id = this.config.data.id;
  url: string = `${environment.base_url}Cuentas/SetDocuments/${this.id}`;
  urlimg = environment.base_urlImg;
  uploadedFiles: any[] = [];
  data: any[] = [];
  description: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  presupuestoDetalleSoporteId: string = '';
  files: any[] = [];

  ngOnInit(): void {
    this.onGetDescription();
    this.onGetFiles();
  }
  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.onGetFiles();
  }

  onGetDescription() {
    this.dataService
      .get(`Cuentas/Description/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.description = resp.body.description;
          this.presupuestoDetalleSoporteId = resp.body.id;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onGetFiles() {
    this.dataService
      .get(`Cuentas/SoporteFileList/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.files = resp.body;
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSetDescription() {
    const data: UpdateDescription = {
      description: this.description,
      id: this.presupuestoDetalleSoporteId,
    };
    this.dataService
      .put(`Cuentas/UpdateDescription`, data)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  // Función para eliminar un archivo
  onDeleteFile(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para eliminar un banco específico
    this.dataService
      .delete(`Cuentas/File/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          // Cuando se completa la eliminación con éxito, mostrar un mensaje de éxito y volver a cargar los datos
          this.customToastService.onCloseToSuccess();
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
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
interface UpdateDescription {
  description: string;
  id: string;
}
