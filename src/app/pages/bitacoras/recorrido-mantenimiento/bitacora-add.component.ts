import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
    selector: 'app-bitacora-add',
    templateUrl: './bitacora-add.component.html',
    imports: [LuxuryAppComponentsModule, CustomInputModule]
})
export default class BitacoraAddComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  applicationUserId: string = '';
  _machineryId: number = null;
  machinery: any = null;
  checked: boolean = false;
  form: FormGroup;

  ngOnInit(): void {
    this.applicationUserId =
      this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
    this._machineryId = this.config.data.machineryId;
    this.onGetMachinerySelectItem(this._machineryId);
    this.onCreateForm();
  }

  onCreateForm() {
    this.form = this.formB.group({
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      descripcion: ['', Validators.required],
      emergencia: [false],
      applicationUserId: [this.authS.applicationUserId],
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    this.form.patchValue({
      applicationUserId: this.authS.applicationUserId,
    });
    this.apiRequestS
      .onPost(`BitacoraMantenimiento`, this.form.value)
      .then((responseData: boolean) => {
        responseData ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onGetMachinerySelectItem(value: number) {
    const urlApi = `Machineries/GetMachinerySelectItem/${value}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.machinery = responseData;
    });
  }
}
