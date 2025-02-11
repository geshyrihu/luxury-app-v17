import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-area-responsable',
  templateUrl: './addoredit-area-responsable.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditAreaResponsableComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);

  submitting: boolean = false;
  id: number = 0;

  form: FormGroup;
  cb_area_empresa: ISelectItem[] = [];

  ngOnInit(): void {
    this.onLoadForm();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  onLoadEnumSelectItem() {
    const urlApi = `ECompanyArea`;
    this.apiRequestS.onGetEnumSelectItem(urlApi).then((responseData: any) => {
      this.cb_area_empresa = responseData;
    });
  }

  onLoadData(id: number) {
    const urlApi = `Departament/${id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onLoadForm() {
    this.form = this.formB.group({
      id: { value: this.id, disabled: true },
      nameArea: ['', [Validators.required, Validators.minLength(5)]],
      companyArea: ['', [Validators.required]],
      position: [0, Validators.required],
      hierarchy: [0, Validators.required],
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Departament`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Departament/${this.id}`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
