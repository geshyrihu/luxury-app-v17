import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DateService } from 'src/app/core/services/date.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-modal-orden-compra',
  templateUrl: './modal-orden-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class ModalOrdenCompraComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  dateService = inject(DateService);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  ordenCompraId: number = 0;
  model: any;
  form: FormGroup = this.formBuilder.group({
    id: [0, Validators.required],
    fechaSolicitud: ['', Validators.required],
    equipoOInstalacion: ['', Validators.required],
    justificacionGasto: ['', Validators.required],
    urlFile: [''],
    folio: [''],
    folioSolicitudCompra: [''],
    customerId: [0],
    personId: [this.authService.personId],
    applicationUserId: [this.authService.applicationUserId],
  });

  ngOnInit(): void {
    flatpickrFactory();
    this.ordenCompraId = this.config.data.ordenCompra.id;
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestService
      .onGetItem(`OrdenCompra/GetForEdit/${this.ordenCompraId}`)
      .then((result: any) => {
        result.fechaSolicitud = this.dateService.getDateFormat(
          result.fechaSolicitud
        );
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    this.submitting = true;

    this.form.patchValue({ personId: this.authService.personId });
    this.apiRequestService
      .onPut(`OrdenCompra/${this.ordenCompraId}`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
