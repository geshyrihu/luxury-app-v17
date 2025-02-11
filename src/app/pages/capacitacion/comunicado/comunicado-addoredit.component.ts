import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { flatpickrFactory } from 'src/app/core/helpers/flatpickr-factory';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-comunicado-addoredit',
    templateUrl: './comunicado-addoredit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class ComunicadoAddOrEditComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);

  submitting: boolean = false;
  id: number = 0;
  errorMessage: string = '';
  file: any = null;
  cb_area_responsable: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    nombreComunicado: ['', Validators.required],
    folioComunicado: ['', Validators.required],
    fechaPublicacion: ['', Validators.required],
    responsibleAreaId: ['', Validators.required],
    responsibleArea: ['', Validators.required],
    comunicadoPath: [''],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
    this.form.patchValue({ area: this.config.data.titulo });
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`Comunicado/${this.id}`)
      .then((responseData: any) => {
        this.form.patchValue(responseData);
      });
  }

  public saveAreResponsableId(e: any): void {
    let find = this.cb_area_responsable.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      responsibleAreaId: find?.value,
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    const model = this.onCreateFormData(this.form.value);
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Comunicado`, model)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Comunicado/${this.id}`, model)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  uploadFile(event) {
    this.file = event.target.files[0];
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('nombreComunicado', String(dto.nombreComunicado));
    formData.append('folioComunicado', dto.folioComunicado);
    formData.append(
      'fechaPublicacion',
      this.dateS.getDateFormat(dto.fechaPublicacion)
    );
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (this.file != null) {
      formData.append('comunicadoPath', this.file);
    }
    return formData;
  }

  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem('ResponsibleArea')
      .then((response: ISelectItem[]) => {
        this.cb_area_responsable = response;
      });
  }
}
