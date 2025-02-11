import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-herramienta',
    templateUrl: './addoredit-herramienta.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class AddoreditToolsComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  dateS = inject(DateService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  file: File;
  model: any;
  photoFileUpdate: boolean = false;

  cb_category: any[] = [{}];
  optionActive: ISelectItem[] = [];
  form: FormGroup;

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      nameTool: ['', [Validators.required, Validators.minLength(5)]],
      brand: ['', [Validators.required]],
      serie: [''],
      model: [''],
      photoPath: [''],
      state: [null, [Validators.required]],
      dateOfPurchase: [this.dateS.getDateNow(), [Validators.required]],
      technicalSpecifications: [''],
      observations: [''],
      categoryId: ['', [Validators.required]],
      applicationUserId: [this.authS.applicationUserId, [Validators.required]],
      customerId: [this.customerIdS.getCustomerId()],
    });
  }

  onLoadSelectItem() {
    this.apiRequestS.onGetEnumSelectItem(`EState`).then((responseData: any) => {
      this.optionActive = responseData;
    });

    this.apiRequestS.onGetSelectItem(`Categories`).then((response: any) => {
      this.cb_category = response;
    });
  }
  onLoadData() {
    const urlApi = `Tools/Get/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.model = responseData;
      responseData.dateOfPurchase = this.dateS.getDateFormat(
        responseData.dateOfPurchase
      );
      this.urlBaseImg = this.model.photoPath;
      this.form.patchValue(responseData);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    const formDataDto = this.onCreateFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Tools`, formDataDto)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Tools/${this.id}`, formDataDto)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();

    formData.append('nameTool', dto.nameTool);
    formData.append('brand', dto.brand);
    formData.append('serie', dto.serie);
    formData.append('model', dto.model);
    formData.append('state', String(dto.state));
    formData.append(
      'dateOfPurchase',
      this.dateS.getDateFormat(dto.dateOfPurchase)
    );
    formData.append('technicalSpecifications', dto.technicalSpecifications);
    formData.append('observations', dto.observations);
    formData.append('categoryId', String(dto.categoryId));
    formData.append('applicationUserId', String(this.authS.applicationUserId));
    formData.append('customerId', String(dto.customerId));
    if (dto.photoPath) {
      formData.append('photoPath', dto.photoPath);
    }

    return formData;
  }
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }
}
