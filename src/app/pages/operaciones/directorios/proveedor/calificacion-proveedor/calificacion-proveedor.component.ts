import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RatingModule } from 'primeng/rating';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-calificacion-proveedor',
  templateUrl: './calificacion-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, RatingModule],
})
export default class CalificacionProveedorComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  providerId: number = 0;
  personId: number = this.authService.personId;
  qualificationProviderId: number = 0;

  form: FormGroup = this.formBuilder.group({
    personId: [this.personId, Validators.required],
    providerId: [this.config.data.providerId, Validators.required],
    precio: [0, Validators.required],
    servicio: [0, Validators.required],
    entrega: [0, Validators.required],
  });

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `ProveedorCalificacion/${this.personId}/${this.providerId}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      if (!result) {
        this.qualificationProviderId = result.id;
        this.form.patchValue(result);
      }
    });
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.qualificationProviderId === 0) {
      this.apiRequestService
        .onPost(`ProveedorCalificacion`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(
          `ProveedorCalificacion/${this.qualificationProviderId}`,
          this.form.value
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
