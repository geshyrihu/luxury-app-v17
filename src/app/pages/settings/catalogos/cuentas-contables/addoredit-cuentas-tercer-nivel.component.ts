import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-cuentas-tercer-nivel',
  templateUrl: './addoredit-cuentas-tercer-nivel.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class AddoreditLedgerAccountsComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  authS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectService = inject(EnumSelectService);

  submitting: boolean = false;

  cb_state: ISelectItem[] = [];

  applicationUserId: string =
    this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
  id: any = 0;
  form: FormGroup;

  async ngOnInit() {
    this.cb_state = await this.enumSelectService.state();
    this.id = this.config.data.id;
    if (this.id !== 0) {
      this.onLoadData();
    }
    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      numeroCuenta: ['', Validators.required],
      descripcion: ['', Validators.required],
      estate: ['', Validators.required],
      information: [''],
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`Cuentas/`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Cuentas/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(`Cuentas/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
}
