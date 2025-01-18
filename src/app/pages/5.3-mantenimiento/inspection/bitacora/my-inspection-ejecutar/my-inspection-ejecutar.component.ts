import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-my-inspection-ejecutar',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './my-inspection-ejecutar.component.html',
})
export default class MyInspectionEjecutarComponent implements OnInit {
  customerInspectionId: string | null = null;
  activatedRoute = inject(ActivatedRoute);
  customerIdService = inject(CustomerIdService);
  autS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  data: any;
  applicationUserId = this.autS.applicationUserId;
  customerId = this.customerIdService.getCustomerId();

  ngOnInit(): void {
    // Capturar el parámetro de la ruta
    this.activatedRoute.paramMap.subscribe((params) => {
      this.customerInspectionId = params.get('customerInspectionId');

      // Cargar datos si hay un ID
      if (this.customerInspectionId) {
        this.onLoadData(this.customerInspectionId);
      }
    });
  }

  onLoadData(customerInspectionId: string): void {
    const urlApi = `InspectionResult/InspectionResultGetById/${customerInspectionId}`;

    this.apiRequestService.onGetList(urlApi).then((response) => {
      this.data = response;
    });
  }

  onSubmit(): void {
    if (!Array.isArray(this.data)) {
      console.error('Datos no son un arreglo:', this.data);
      return;
    }

    const inspectionUpdates = this.data.flatMap((area: any) =>
      area.items.map((revision: any) => ({
        id: revision.id,
        state: revision.state,
        observations: revision.observations || '',
      }))
    );

    console.log('🚀 ~ inspectionUpdates:', inspectionUpdates); // Verifica el contenido de la variable
    const data = {
      id: 'sdfassddasd',
      state: true,
      observations: 'observations',
    };
    // Enviar datos de inspección en formato JSON
    const urlApi = `InspectionResult/UpdateInspectionData/${this.customerInspectionId}/${this.applicationUserId}`;
    this.apiRequestService
      .onPost(urlApi, inspectionUpdates)
      .then((result: any) => {
        console.log('🚀 ~ result:', result);
        // this.onSubmitImages();
        // Luego de enviar los datos JSON, enviar las imágenes
      })
      .catch((error) => {
        console.error('Error al enviar datos:', error);
      });
  }

  onSubmitImages(): void {
    const formData = new FormData();

    // Iterar sobre los datos de la inspección y agregar las imágenes
    this.data.forEach((area: any) => {
      area.items.forEach((revision: any) => {
        revision.images.forEach((img: any) => {
          if (img.photoPath) {
            formData.append('images[]', img.photoPath, img.photoPath.name);
          }
        });
      });
    });

    // Realizar POST para subir las imágenes
    const urlApi = `InspectionResult/UpdateInspectionImages/${this.customerInspectionId}/${this.customerId}`;
    this.apiRequestService.onPost(urlApi, formData).then((result: any) => {
      console.log('🚀 ~ result:', result);
    });
  }

  onAddImages(areaId: string, revisionId: string, images: File[]): void {
    const area = this.data.find((area: any) => area.id === areaId);
    if (!area) {
      console.error(`Área con ID ${areaId} no encontrada`);
      return;
    }

    const revision = area.items.find(
      (revision: any) => revision.id === revisionId
    );
    if (!revision) {
      console.error(`Revisión con ID ${revisionId} no encontrada`);
      return;
    }

    // Asignamos las imágenes a la revisión específica
    images.forEach((file: File) => {
      const image = {
        id: '', // Id vacío ya que es una nueva imagen
        photoPath: file, // Se asigna el archivo de la imagen
      };
      revision.images.push(image); // Añadimos la imagen al array de imágenes de la revisión
    });

    console.log('Imágenes añadidas correctamente', revision.images);
  }

  onFileSelected(event: any, areaId: string, revisionId: string): void {
    const files: File[] = Array.from(event.target.files);
    this.onAddImages(areaId, revisionId, files);
  }

  onDeleteImage(imageId: string, areaId: string, revisionId: string): void {
    const area = this.data.find((area: any) => area.id === areaId);
    if (!area) {
      console.error(`Área con ID ${areaId} no encontrada`);
      return;
    }

    const revision = area.items.find(
      (revision: any) => revision.id === revisionId
    );
    if (!revision) {
      console.error(`Revisión con ID ${revisionId} no encontrada`);
      return;
    }

    // Eliminar imagen de la revisión
    revision.images = revision.images.filter((img: any) => img.id !== imageId);

    console.log('Imagen eliminada correctamente', revision.images);

    // Llamar al API para eliminar la imagen del backend
    const urlApi = `InspectionResult/DeleteInspectionImage/${imageId}/${this.customerId}`;
    this.apiRequestService.onDelete(urlApi).then((result: any) => {
      console.log('Imagen eliminada del backend', result);
    });
  }
}
