import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-my-inspection-add-images',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './my-inspection-add-images.component.html',
})
export default class MyInspectionAddImagesComponent {
  apiRequestS = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  inspectionResultId: string = '';
  submitting: boolean = false;

  // Contiene las imágenes obtenidas del backend
  existingImages: any[] = [];

  // Contiene las imágenes nuevas antes de enviarlas
  newImages: any[] = [];

  ngOnInit(): void {
    this.inspectionResultId = this.config.data.inspectionResultId;
    this.loadExistingImages();
  }

  /**
   * Cargar imágenes existentes desde el backend.
   */
  loadExistingImages(): void {
    const urlApi = `InspectionResultImage/${
      this.inspectionResultId
    }/${this.customerIdService.getCustomerId()}`;

    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.existingImages = result; // Guardamos las imágenes recuperadas
    });
  }

  /**
   * Manejar la selección de nuevas imágenes desde el input.
   */
  onFileSelected(event: any): void {
    const files: File[] = Array.from(event.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const image = {
          id: '', // Nueva imagen, sin ID
          file: file, // Archivo para enviar al backend
          url: e.target.result, // URL de vista previa
        };

        this.newImages.push(image);
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Guardar todas las imágenes nuevas en el backend.
   */
  onSaveImages(): void {
    const formData = new FormData();

    this.newImages.forEach((image) => {
      formData.append('images', image.file); // Solo pasamos los archivos
    });

    const urlApi = `InspectionResultImage/${
      this.inspectionResultId
    }?customerId=${this.customerIdService.getCustomerId()}`;

    this.apiRequestS.onPost(urlApi, formData).then((result: any) => {
      this.loadExistingImages();
    });
  }
  /**
   * Eliminar imágenes que aún no han sido enviadas al backend.
   */
  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
  }

  /**
   * Eliminar una imagen que ya está en el backend.
   */
  deleteExistingImage(imageId: string): void {
    const urlApi = `InspectionResultImage/DeleteInspectionImage/${imageId}/${this.customerIdService.getCustomerId()}`;

    this.apiRequestS.onDelete(urlApi).then(() => {
      // Filtrar la imagen eliminada
      this.existingImages = this.existingImages.filter(
        (img) => img.id !== imageId
      );
    });
  }
}
