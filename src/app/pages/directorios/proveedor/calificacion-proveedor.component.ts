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
    imports: [LuxuryAppComponentsModule, RatingModule]
})
export default class CalificacionProveedorComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  providerId: number = 0;
  qualificationProviderId: number = 0;

  form: FormGroup = this.formB.group({
    applicationUserId: [this.authS.applicationUserId, Validators.required],
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
    const urlApi = `QualificationProvider/${this.authS.applicationUserId}/${this.providerId}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      if (responseData != null) {
        this.qualificationProviderId = responseData.id;
        this.form.patchValue(responseData);
      }
    });
  }

  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.qualificationProviderId === 0) {
      this.apiRequestS
        .onPost(`QualificationProvider`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(
          `QualificationProvider/${this.qualificationProviderId}`,
          this.form.value
        )
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
