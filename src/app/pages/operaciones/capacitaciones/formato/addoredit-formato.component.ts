import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-formato',
  templateUrl: './addoredit-formato.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditFormatoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;
  id: number = 0;
  file: any = null;
  cb_area_responsable: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    folio: ['', Validators.required],
    descripcion: ['', Validators.required],
    pathFormato: [''],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.onLoadSelectItem();
    this.form.patchValue({ area: this.config.data.titulo });

    this.apiRequestService
      .onGetItem(`Formato/${this.id}`)
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
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Formato`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Formato/${this.id}`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }
  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('folio', String(dto.folio));
    formData.append('descripcion', dto.descripcion);
    formData.append('pathFormato', String(dto.pathFormato));
    if (this.file != null) {
      formData.append('pathFormato', this.file);
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
