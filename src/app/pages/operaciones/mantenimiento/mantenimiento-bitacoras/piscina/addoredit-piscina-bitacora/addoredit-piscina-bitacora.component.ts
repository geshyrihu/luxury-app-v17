import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-piscina-bitacora',
  templateUrl: './addoredit-piscina-bitacora.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditPiscinaBitacoraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;

  id: number = 0;
  urlBaseImg = '';
  model: any;
  form: FormGroup;

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      piscinaId: [this.config.data.piscinaId],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      cl: ['', Validators.required],
      ph: ['', Validators.required],
      temperatura: [null, Validators.required],
      alkalinidad: [],
      dureza: [''],
      aplicationCl: [0],
      aplicationPhMas: [0],
      aplicationPhMenos: [0],
      cepillado: [false, Validators.required],
      aspirado: [false, Validators.required],
      cenefas: [false, Validators.required],
      personId: [this.authService.userTokenDto.infoEmployeeDto.personId],
    });
  }

  onLoadData() {
    const urlApi = `piscinabitacora/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.model = result;
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    this.form.patchValue({
      piscinaId: this.config.data.piscinaId,
    });
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`piscinabitacora`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`piscinabitacora/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
