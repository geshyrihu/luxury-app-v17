import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule, {
  flatpickrFactory,
} from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-modal-add-proveedor',
  templateUrl: './modal-add-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class ModalAddProveedorComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;
  form: FormGroup;
  cb_providers: ISelectItem[] = [];

  ngOnInit(): void {
    flatpickrFactory();
    this.form = this.formBuilder.group({
      solicitudCompraId: [
        this.config.data.solicitudCompraId,
        Validators.required,
      ],
      nameProvider: ['', { validators: [Validators.required] }],
      fechaCotizacion: ['', { validators: [Validators.required] }],
      numeroCotizacion: [''],
    });
  }
  onSubmit() {
    this.submitting = true;
    this.apiRequestService
      .onPost(`cotizacionproveedor`, this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
}
