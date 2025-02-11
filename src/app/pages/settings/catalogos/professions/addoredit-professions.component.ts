import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-professions',
  templateUrl: './addoredit-professions.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditProfessionsComponent implements OnInit {
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  apiRequestS = inject(ApiRequestService);

  submitting: boolean = false;
  id: number = 0;
  cb_departament: ISelectItem[] = [];

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    departament: [null, [Validators.required]],
    nameProfession: ['', [Validators.required, Validators.minLength(5)]],
    professionIdIndex: ['', [Validators.required]],
    description: ['', [Validators.required]],
    requirements: ['', [Validators.required]],
    responsibilities: ['', [Validators.required]],
  });

  onLoadSelectItem() {
    const urlApi = `EDepartament`;
    this.apiRequestS.onGetEnumSelectItem(urlApi).then((result: any) => {
      this.cb_departament = result;
    });
  }

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  onLoadData(id: number) {
    const urlApi = `Professions/${id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Professions`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Professions/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
