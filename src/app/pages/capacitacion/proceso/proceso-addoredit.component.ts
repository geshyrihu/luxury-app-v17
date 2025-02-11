import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-proceso-addoredit',
    templateUrl: './proceso-addoredit.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class ProcesoAddOrEditComponent implements OnInit {
  formB = inject(FormBuilder);
  apiRequestS = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  submitting: boolean = false;
  id: number = 0;
  file: any = null;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_area_responsable: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    folio: ['', Validators.required],
    descripcion: ['', Validators.required],
    pathFormato: [''],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadSelectItem();
    if (this.id !== 0) this.onLoadData();
    this.form.patchValue({ area: this.config.data.titulo });
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`FormatoProceso/${this.id}`)
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
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`FormatoProceso`, model)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`FormatoProceso/${this.id}`, model)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
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
    this.apiRequestS
      .onGetSelectItem('ResponsibleArea')
      .then((response: ISelectItem[]) => {
        this.cb_area_responsable = response;
      });
  }
}
