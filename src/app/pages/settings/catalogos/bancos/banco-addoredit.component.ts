import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-banco-addoredit',
  templateUrl: './banco-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class BancoAddOrEditComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    code: ['', [Validators.required, Validators.maxLength(3)]],
    shortName: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(15)],
      ,
    ],
    largeName: ['', [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `banks/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`Banks`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`Banks/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
