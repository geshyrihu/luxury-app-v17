import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import MyInspectionAddImagesComponent from '../my-inspection-add-images/my-inspection-add-images.component';
@Component({
  selector: 'app-my-inspection-ejecutar',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './my-inspection-ejecutar.component.html',
})
export default class MyInspectionEjecutarComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiRequestService = inject(ApiRequestService);
  autS = inject(AuthService);
  custIdService = inject(CustomerIdService);
  customerInspectionId: string | null = null;
  dialogHandlerService = inject(DialogHandlerService);
  data: any;
  applicationUserId = this.autS.applicationUserId;
  customerId = this.custIdService.getCustomerId();

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

  saveRevision(revision: any): void {
    const urlApi = `InspectionResult/UpdateInspectionData/${this.customerInspectionId}/${this.applicationUserId}`;

    const revisionData = {
      id: revision.id,
      state: revision.state,
      observations: revision.observations || '',
    };

    this.apiRequestService
      .onPost(urlApi, [revisionData]) // Se envía en un array para mantener compatibilidad con la API
      .then((result: any) => {
        console.log('Datos guardados exitosamente', result);
      })
      .catch((error) => {
        console.error('Error al guardar revisión:', error);
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

    // Enviar datos de inspección en formato JSON
    const urlApi = `InspectionResult/UpdateInspectionData/${this.customerInspectionId}/${this.applicationUserId}`;
    this.apiRequestService
      .onPost(urlApi, inspectionUpdates)
      .then((result: any) => {
        // this.onSubmitImages();
        // Luego de enviar los datos JSON, enviar las imágenes
      })
      .catch((error) => {
        console.error('Error al enviar datos:', error);
      });
  }

  onModalAddImages(inspectionResultId: string) {
    this.dialogHandlerService
      .openDialog(
        MyInspectionAddImagesComponent,
        { inspectionResultId },
        'Agregar imágenes',
        this.dialogHandlerService.dialogSizeMd
      )
      .then(() => {
        this.onLoadData(this.customerInspectionId);
      });
  }
}
