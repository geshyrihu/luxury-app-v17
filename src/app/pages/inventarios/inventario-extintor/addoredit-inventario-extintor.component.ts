import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-addoredit-inventario-extintor',
    templateUrl: './addoredit-inventario-extintor.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule],
    providers: [EnumSelectService]
})
export default class AddoreditInventarioExtintorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  submitting: boolean = false;

  cb_extintor: ISelectItem[] = [];
  photoFileUpdate: boolean = false;
  urlBaseImg: string = '';
  id: number = 0;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdS.getCustomerId(), Validators.required],
    eExtintor: [null, Validators.required],
    ubicacion: ['', Validators.required],
    photo: [''],
    applicationUserId: [this.authS.applicationUserId],
  });

  uploadFile(file: any) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photo: file });
  }

  async ngOnInit() {
    this.cb_extintor = await this.enumSelectS.extintor();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `InventarioExtintor/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.urlBaseImg = responseData.currentPhoto;
      this.form.patchValue(responseData);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`InventarioExtintor`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`InventarioExtintor/${this.id}`, formData)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  private createFormData(dto: any): FormData {
    const formData = new FormData();
    formData.append('customerId', String(dto.customerId));
    formData.append('eExtintor', String(dto.eExtintor));
    formData.append('ubicacion', String(dto.ubicacion));
    formData.append('applicationUserId', String(this.authS.applicationUserId));
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.photo) {
      formData.append('photo', dto.photo);
    }
    return formData;
  }
}
