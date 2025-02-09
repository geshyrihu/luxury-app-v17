import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-catalog-asset-addoredit',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './catalog-asset-addoredit.component.html',
})
export default class CatalogAssetAddoreditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;

  cb_category: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    folio: ['', [Validators.required, Validators.maxLength(5)]],
    name: ['', [Validators.required, Validators.maxLength(50)], ,],
    assetCategory: [null, Validators.required],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
    this.onLoadEnumSelectItem();
  }
  onLoadData() {
    const urlApi = `CatalogAsset/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onLoadEnumSelectItem() {
    this.apiRequestService
      .onGetEnumSelectItem(`EAssetCategory`)
      .then((result: any) => {
        this.cb_category = result;
      });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`CatalogAsset`, this.form.value)
        .then((result: any) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`CatalogAsset/${this.id}`, this.form.value)
        .then((result: any) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
