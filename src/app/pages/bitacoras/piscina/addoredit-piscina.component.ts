import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-piscina',
  templateUrl: './addoredit-piscina.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditPiscinaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  custIdService = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  file: File;
  model: any;
  photoFileUpdate: boolean = false;

  cb_typePiscina: ISelectItem[] = [];
  form: FormGroup;

  ngOnInit(): void {
    this.onLoadEnumSelectItem();

    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      name: ['', [Validators.required, Validators.maxLength(50)]],
      ubication: ['', [Validators.required, Validators.maxLength(50)]],
      volumen: [
        '',
        [Validators.required, Validators.min(0), Validators.max(1000000)],
      ],
      pathImage: [''],
      typePiscina: [null, Validators.required],
      applicationUserId: [this.authS.applicationUserId],
      customerId: [this.custIdService.getCustomerId()],
    });
  }

  onLoadData() {
    const urlApi = `piscina/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.model = result;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    const formDataDto = this.onCreateFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost('piscina', formDataDto)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`piscina/${this.id}`, formDataDto)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();

    formData.append('name', dto.name);
    formData.append('ubication', dto.ubication);
    formData.append('volumen', dto.volumen);
    formData.append('typePiscina', String(dto.typePiscina));
    formData.append('customerId', String(this.custIdService.customerId));
    formData.append('applicationUserId', String(this.authS.applicationUserId));
    formData.append('customerId', String(dto.customerId));
    if (dto.pathImage) {
      formData.append('pathImage', dto.pathImage);
    }
    return formData;
  }

  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ pathImage: file });
  }

  onLoadEnumSelectItem() {
    this.apiRequestService
      .onGetEnumSelectItem(`ETypePiscina`)
      .then((result: any) => {
        this.cb_typePiscina = result;
      });
  }
}
