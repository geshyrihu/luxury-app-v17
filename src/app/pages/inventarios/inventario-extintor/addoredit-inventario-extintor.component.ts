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
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddoreditInventarioExtintorComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  cb_extintor: ISelectItem[] = [];
  photoFileUpdate: boolean = false;
  urlBaseImg: string = '';
  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.custIdService.getCustomerId(), Validators.required],
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
    this.cb_extintor = await this.enumSelectService.extintor();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `InventarioExtintor/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.urlBaseImg = result.currentPhoto;
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`InventarioExtintor`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`InventarioExtintor/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
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
