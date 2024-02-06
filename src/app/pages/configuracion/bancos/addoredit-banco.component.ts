import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IBankAddOrEditDto } from 'src/app/core/interfaces/IBankAddOrEditDto.interface';
import { ApiRequestService } from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-banco',
  templateUrl: './addoredit-banco.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditBancoComponent implements OnInit {
  public apiRequestService = inject(ApiRequestService);
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
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
    this.apiRequestService
      .onGetItem<IBankAddOrEditDto>(`Banks/${this.id}`)
      .then((result: IBankAddOrEditDto) => {
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPostForModal(`Banks`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPutForModal(`Banks/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
