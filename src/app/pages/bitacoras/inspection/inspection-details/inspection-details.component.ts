import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import InspectionAddRevisionComponent from '../inspection-add-revision/inspection-add-revision.component';
import InspectionCondominiumAssetAddComponent from '../inspection-condominium-asset-add/inspection-condominium-asset.component';
import InspectionCondominiumAssetEditComponent from '../inspection-condominium-asset-edit/inspection-condominium-asset-edit.component';

@Component({
    selector: 'app-inspection-details',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    templateUrl: './inspection-details.component.html'
})
export default class InspectionDetailsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  data: any;

  nombre: string = 'Equipos electromecánicos';
  areaResponsable: string = 'Mantenimiento';
  id: string = this.activatedRoute.snapshot.paramMap.get('id');
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `InspectionCondominiumAsset/List/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
  onDeleteArea(id: string, areas: any[]) {
    const urlApi = `InspectionCondominiumAsset/DeleteArea/${id}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: any) => {
      if (responseData) {
        const index = areas.findIndex(
          (item) => item.inspectionCondominiumAssetId === id
        );
        if (index !== -1) {
          areas.splice(index, 1); // Elimina el área de la lista
        }
      }
    });
  }

  onDeleteReview(reviewId: number, reviews: any[]) {
    const urlApi = `InspectionCondominiumAsset/DeleteReview/${reviewId}`;
    this.apiRequestS.onDelete(urlApi).then((responseData: any) => {
      if (responseData) {
        const index = reviews.findIndex((item) => item.id === reviewId);
        if (index !== -1) {
          reviews.splice(index, 1); // Elimina el elemento del array
        }
      }
    });
  }

  onModalInspectionCondominiumAssetAdd(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspectionCondominiumAssetAddComponent,
        {
          inspectionId: data.inspectionId,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        this.onLoadData();
      });
  }
  onModalInspectionCondominiumAssetEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        InspectionCondominiumAssetEditComponent,
        {
          inspectionId: data.inspectionId,
          inspectionCondominiumAssetId: data.inspectionCondominiumAssetId,
        },
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onModalAddRevision() {
    this.dialogHandlerS.openDialog(
      InspectionAddRevisionComponent,
      { title: 'Agregar área' },
      'Agregar revisión',
      this.dialogHandlerS.dialogSizeMd
    );
  }
}
