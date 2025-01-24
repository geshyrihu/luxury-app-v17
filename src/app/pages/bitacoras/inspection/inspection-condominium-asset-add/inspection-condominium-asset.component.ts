import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-inspection-condominium-asset',
  templateUrl: './inspection-condominium-asset.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class InspectionCondominiumAssetAddComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  fb = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  custIdService = inject(CustomerIdService);

  cb_activos: any[] = [];
  cb_inspection_reviews_catalog: any[] = [];
  submitting: boolean = false;
  form: FormGroup = this.fb.group({
    id: { value: '', disabled: true },
    inspectionId: [this.config.data.inspectionId, Validators.required],
    condominiumAssetId: ['', Validators.required],
    condominiumAssetName: ['', Validators.required],
    position: [0, [Validators.required, Validators.min(1)]],
    inspectionReviews: this.fb.array([]), // Aquí está el control 'inspectionReviews'
  });
  reviewsControl = this.form.get('inspectionReviews') as FormArray;

  ngOnInit(): void {
    this.onLoadActivos();
    this.onLoadRevisionsCatalog();
  }

  loadInspectionReviews(reviews: any[]) {
    const reviewsControl = this.form.get('inspectionReviews') as FormArray;
    reviewsControl.clear(); // Limpia las revisiones actuales
    reviews.forEach((review) => {
      reviewsControl.push(
        this.fb.group({
          id: review.id,
          inspectionReviewsCatalogId: review.value,
          catalogDescription: review.label,
        })
      );
    });
  }

  onLoadActivos() {
    this.apiRequestService
      .onGetSelectItem(`CondominiumAsset/${this.custIdService.customerId}`)
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
    if (!reviewId) return; // Evita valores nulos o inválidos.

    const reviewsControl = this.form.get('inspectionReviews') as FormArray;

    // Busca la revisión en el catálogo.
    const selectedReview = this.cb_inspection_reviews_catalog.find(
      (review) => review.value === reviewId
    );

    if (selectedReview) {
      // Agrega la revisión al FormArray.
      reviewsControl.push(
        this.fb.group({
          value: selectedReview.value,
          label: selectedReview.label,
        })
      );

      // Filtra el catálogo para eliminar la revisión seleccionada.
      this.cb_inspection_reviews_catalog =
        this.cb_inspection_reviews_catalog.filter(
          (review) => review.value !== reviewId
        );
    }
  }

  onRemoveReview(index: number) {
    const reviewsControl = this.form.get('inspectionReviews') as FormArray;

    // Obtén la revisión eliminada.
    const removedReview = reviewsControl.at(index).value;

    // Elimina la revisión del FormArray.
    reviewsControl.removeAt(index);

    // Reintegra la revisión al catálogo si no está ya presente.
    const existsInCatalog = this.cb_inspection_reviews_catalog.some(
      (review) => review.value === removedReview.value
    );

    if (!existsInCatalog) {
      this.cb_inspection_reviews_catalog.push({
        value: removedReview.value,
        label: removedReview.label,
      });

      // Ordena el catálogo para mantener consistencia visual.
      this.cb_inspection_reviews_catalog.sort((a, b) =>
        a.label.localeCompare(b.label)
      );
    }
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    const reviewsControl = this.form.get('inspectionReviews') as FormArray;

    const data = {
      inspectionId: this.form.get('inspectionId')?.value,
      condominiumAssetId: this.form.get('condominiumAssetId')?.value,
      position: this.form.get('position')?.value,
      inspectionReviews: reviewsControl.value.map((review: any) => ({
        value: review.value,
      })),
    };

    const urlApi = `InspectionCondominiumAsset`;
    this.apiRequestService.onPost(urlApi, data).then((result: any) => {
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
