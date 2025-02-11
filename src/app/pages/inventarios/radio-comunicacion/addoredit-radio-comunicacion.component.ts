import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { IRadioComunicacionAddOrEdit } from 'src/app/core/interfaces/radio-comunicacion-add-or-edit.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-radio-comunicacion',
  templateUrl: './addoredit-radio-comunicacion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditRadioComunicacionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  dateS = inject(DateService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  model: IRadioComunicacionAddOrEdit;
  photoFileUpdate: boolean = false;
  cb_application_user: ISelectItem[] = [];
  cb_area_responsable: ISelectItem[] = [];
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    marca: ['', Validators.required],
    fotografia: [''],
    modelo: ['', Validators.required],
    serie: ['', Validators.required],
    fechaCompra: ['', Validators.required],
    customerId: [],
    bateria: ['', Validators.required],
    responsibleAreaId: [0, Validators.required],
    responsibleAreaName: [''],
    applicationUserId: [null],
    applicationUser: [''],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `RadioComunicacion/${this.id}`;
    this.apiRequestS
      .onGetItem<IRadioComunicacionAddOrEdit>(urlApi)
      .then((result: IRadioComunicacionAddOrEdit) => {
        this.form.patchValue(result);
      });
  }

  // ...Recibiendo archivo emitido
  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ fotografia: file });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost('RadioComunicacion', formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`RadioComunicacion/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  public saveAreResponsableId(e: any): void {
    let find = this.cb_area_responsable.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      responsibleAreaId: find?.value,
    });
  }
  public saveApplicationUserId(e: any): void {
    let find = this.cb_application_user.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      applicationUserId: find?.value,
    });
  }

  private createFormData(dto: IRadioComunicacionAddOrEdit): FormData {
    const formData = new FormData();
    formData.append('marca', dto.marca);
    formData.append('modelo', dto.modelo);
    formData.append('serie', dto.serie);
    formData.append('fechaCompra', this.dateS.getDateFormat(dto.fechaCompra));
    formData.append('bateria', dto.bateria);

    if (this.id == 0) {
      formData.append('customerId', String(this.customerIdS.customerId));
    } else {
      formData.append('customerId', String(dto.customerId));
    }
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));

    if (dto.applicationUserId != null) {
      formData.append('applicationUserId', String(dto.applicationUserId));
    }

    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (dto.fotografia) {
      formData.append('fotografia', dto.fotografia);
    }
    return formData;
  }

  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem(`ApplicationUser/${this.customerIdS.getCustomerId()}`)
      .then((response: any) => {
        this.cb_application_user = response;
      });

    this.apiRequestS
      .onGetSelectItem(`ResponsibleArea`)
      .then((response: any) => {
        this.cb_area_responsable = response;
      });
  }
}
