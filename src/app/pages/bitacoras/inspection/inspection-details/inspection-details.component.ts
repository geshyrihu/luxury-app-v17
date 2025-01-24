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
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './inspection-details.component.html',
})
export default class InspectionDetailsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  data: any;

  nombre: string = 'Equipos electromecánicos';
  areaResponsable: string = 'Mantenimiento';
  id: string = this.activatedRoute.snapshot.paramMap.get('id');
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `InspectionCondominiumAsset/List/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onDeleteReview(reviewId) {
    const urlApi = `InspectionCondominiumAsset/DeleteReview/${reviewId}`;
    this.apiRequestService.onDelete(urlApi).then((result: any) => {
      this.data = result;
    });
  }
  onModalInspectionCondominiumAssetAdd(data: any) {
    this.dialogHandlerService
      .openDialog(
        InspectionCondominiumAssetAddComponent,
        {
          inspectionId: data.inspectionId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalInspectionCondominiumAssetEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        InspectionCondominiumAssetEditComponent,
        {
          inspectionId: data.inspectionId,
          inspectionCondominiumAssetId: data.inspectionCondominiumAssetId,
        },
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalAddRevision() {
    this.dialogHandlerService.openDialog(
      InspectionAddRevisionComponent,
      { title: 'Agregar área' },
      'Agregar revisión',
      this.dialogHandlerService.dialogSizeMd
    );
  }
}
