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
  selector: 'app-form-bitacora-mantenimiento',
  templateUrl: './form-bitacora-mantenimiento.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class FormBitacoraMantenimientoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);
  customToastService = inject(CustomToastService);

  submitting: boolean = false;

  userId = '';
  form: FormGroup;
  maquinarias: any[] = [];

  formFecha: UntypedFormGroup;

  public saveMaquinariaId(e): void {
    let find = this.maquinarias.find(
      (x) => x?.nameMachinery === e.target.value
    );
    this.form.patchValue({
      machineryId: find?.id,
    });
  }
  ngOnInit(): void {
    this.userId =
      this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
    this.onLoadMachinery();
    this.form = this.formBuilder.group({
      customerId: [this.customerIdService.getCustomerId(), Validators.required],
      machineryId: ['', Validators.required],
      machinery: ['', Validators.required],
      descripcion: ['', Validators.required],
      emergencia: [false],
      employeeId: [
        this.authService.userTokenDto.infoEmployeeDto.employeeId,
        Validators.required,
      ],
    });

    this.formFecha = this.formBuilder.group({
      fechaHora: [],
    });
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    this.apiRequestService
      .onPost(`BitacoraMantenimiento`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }

  onLoadMachinery() {
    const urlApi = `SelectItem/ListadoInstalaciones/${this.customerIdService.getCustomerId()}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.maquinarias = result;
    });
  }
}
