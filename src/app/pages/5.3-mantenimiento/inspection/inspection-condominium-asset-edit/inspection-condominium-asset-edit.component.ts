import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-inspection-condominium-asset-edit',
  templateUrl: './inspection-condominium-asset-edit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class InspectionCondominiumAssetEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  fb = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdService = inject(CustomerIdService);

  cb_activos: any[] = [];
  cb_inspection_reviews_catalog: any[] = [];
  submitting: boolean = false;
  form: FormGroup = this.fb.group({
    id: { value: '', disabled: true },
    inspectionId: [this.config.data.inspectionId, Validators.required],
    condominiumAssetId: ['', Validators.required],
    condominiumAssetName: ['', Validators.required],
    position: [0, [Validators.required, Validators.min(1)]],
    inspectionReviews: this.fb.array([]), // Aquí agregamos las revisiones
  });

  reviewsControl = this.form.get('inspectionReviews') as FormArray;

  ngOnInit(): void {
    this.onLoadActivos();
    this.onLoadRevisionsCatalog();
    this.loadInspectionCondominiumAsset();
  }

  loadInspectionCondominiumAsset() {
    const assetId = this.config.data.inspectionCondominiumAssetId;
    if (assetId) {
      this.apiRequestService
        .onGetItem(`InspectionCondominiumAsset/${assetId}`)
        .then((resp: any) => {
          if (resp) {
            // Rellenar los valores del formulario con la respuesta del servidor
            this.form.patchValue({
              id: resp.id,
              inspectionId: resp.inspectionId,
              condominiumAssetId: resp.condominiumAssetId,
              condominiumAssetName: resp.condominiumAssetName,
              position: resp.position,
            });

            // Cargar las revisiones de inspección
            this.loadInspectionReviews(resp.inspectionReviews);
          }
        });
    }
  }

  loadInspectionReviews(reviews: any[]) {
    // Limpiar el FormArray antes de agregar nuevas revisiones
    this.reviewsControl.clear();

    // Agregar cada revisión al FormArray
    reviews.forEach((review) => {
      this.reviewsControl.push(
        this.fb.group({
          value: [review.value],
          label: [review.label],
        })
      );
    });

    //revisar el cb_inspection_reviews_catalog para eliminar los items que ya estan en el formArray
    this.cb_inspection_reviews_catalog =
      this.cb_inspection_reviews_catalog.filter(
        (review) =>
          !reviews.some((reviewForm) => reviewForm.value === review.value)
      );
  }

  onLoadActivos() {
    this.apiRequestService
      .onGetSelectItem(`CondominiumAsset/${this.customerIdService.customerId}`)
      .then((resp: any) => {
        this.cb_activos = resp;
      });
  }

  onLoadRevisionsCatalog() {
    this.apiRequestService
      .onGetSelectItem(`InspectionReviewsCatalog`)
      .then((resp: any) => {
        this.cb_inspection_reviews_catalog = resp;
      });
  }

  onAddReview(reviewId: string) {
    if (!reviewId) return;

    const reviewsControl = this.form.get('inspectionReviews') as FormArray;

    const selectedReview = this.cb_inspection_reviews_catalog.find(
      (review) => review.value === reviewId
    );

    if (selectedReview) {
      reviewsControl.push(
        this.fb.group({
          value: selectedReview.value,
          label: selectedReview.label,
        })
      );

      this.cb_inspection_reviews_catalog =
        this.cb_inspection_reviews_catalog.filter(
          (review) => review.value !== reviewId
        );
    }
  }

  onRemoveReview(index: number) {
    const reviewsControl = this.form.get('inspectionReviews') as FormArray;

    const removedReview = reviewsControl.at(index).value;

    reviewsControl.removeAt(index);

    const existsInCatalog = this.cb_inspection_reviews_catalog.some(
      (review) => review.value === removedReview.value
    );

    if (!existsInCatalog) {
      this.cb_inspection_reviews_catalog.push({
        value: removedReview.value,
        label: removedReview.label,
      });

      this.cb_inspection_reviews_catalog.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
    }
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    const reviewsControl = this.form.get('inspectionReviews') as FormArray;

    const data = {
      id: this.form.get('id')?.value,
      inspectionId: this.form.get('inspectionId')?.value,
      condominiumAssetId: this.form.get('condominiumAssetId')?.value,
      position: this.form.get('position')?.value,
      inspectionReviews: reviewsControl.value.map((review: any) => ({
        value: review.value,
      })),
    };

    const urlApi = `InspectionCondominiumAsset/${data.id}`;
    this.apiRequestService.onPut(urlApi, data).then((result: any) => {
      if (result) {
        this.ref.close(true);
      } else {
        this.submitting = false;
      }
    });
  }

  saveCondominiumAsset(e: any): void {
    const selected = this.cb_activos.find((x) => x.label === e.target.value);
    if (selected) {
      this.form.patchValue({
        condominiumAssetId: selected.value,
        condominiumAssetName: selected.label,
      });
    }
  }
}
