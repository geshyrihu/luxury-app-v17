import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-comunicado',
  templateUrl: './addoredit-comunicado.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditComunicadoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  dateService = inject(DateService);
  ref = inject(DynamicDialogRef);
  formBuilder = inject(FormBuilder);

  submitting: boolean = false;
  id: number = 0;
  errorMessage: string = '';
  file: any = null;
  cb_area_responsable: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
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
    this.apiRequestService
      .onGetItem(`Comunicado/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
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
    if (!this.apiRequestService.validateForm(this.form)) return;

    const model = this.onCreateFormData(this.form.value);
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Comunicado`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Comunicado/${this.id}`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
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
      this.dateService.getDateFormat(dto.fechaPublicacion)
    );
    formData.append('responsibleAreaId', String(dto.responsibleAreaId));
    if (this.file != null) {
      formData.append('comunicadoPath', this.file);
    }
    return formData;
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem('ResponsibleArea')
      .then((response: ISelectItem[]) => {
        this.cb_area_responsable = response;
      });
  }
}
