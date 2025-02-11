import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-bitacora-mantenimiento-form',
  templateUrl: './bitacora-mantenimiento-form.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class BitacoraMantenimientoFormComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;

  userId = '';
  form: FormGroup;
  maquinarias: any[] = [];

  formFecha: UntypedFormGroup;

  public saveMaquinariaId(e): void {
    let find = this.maquinarias.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  ngOnInit(): void {
    this.userId = this.authS.userTokenDto.infoUserAuthDto.applicationUserId;
    this.onLoadMachinery();
    this.form = this.formB.group({
      customerId: [this.customerIdS.getCustomerId(), Validators.required],
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      descripcion: ['', Validators.required],
      emergencia: [false],
      applicationUserId: [this.authS.applicationUserId],
    });

    this.formFecha = this.formB.group({
      fechaHora: [],
    });
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;
    this.form.patchValue({
      applicationUserId: this.authS.applicationUserId,
    });
    this.apiRequestS
      .onPost(`BitacoraMantenimiento`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onLoadMachinery() {
    const urlApi = `SelectItem/ListadoInstalaciones/${this.customerIdS.getCustomerId()}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.maquinarias = result;
    });
  }
}
