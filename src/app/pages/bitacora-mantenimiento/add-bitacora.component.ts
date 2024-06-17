import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-add-bitacora',
  templateUrl: './add-bitacora.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddBitacoraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  applicationUserId: string = '';
  _machineryId: number = null;
  machinery: any = null;
  checked: boolean = false;
  form: FormGroup;

  ngOnInit(): void {
    this.applicationUserId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this._machineryId = this.config.data.machineryId;
    this.onGetMachinerySelectItem(this._machineryId);
    this.onCreateForm();
  }

  onCreateForm() {
    this.form = this.formBuilder.group({
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      descripcion: ['', Validators.required],
      emergencia: [false],
      // personId: [this.authService.personId, Validators.required],
      applicationUserId: [this.authService.applicationUserId],
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;
    this.form.patchValue({
      applicationUserId: this.authService.applicationUserId,
    });
    this.apiRequestService
      .onPost(`BitacoraMantenimiento`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onGetMachinerySelectItem(value: number) {
    const urlApi = `Machineries/GetMachinerySelectItem/${value}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.machinery = result;
    });
  }
}
