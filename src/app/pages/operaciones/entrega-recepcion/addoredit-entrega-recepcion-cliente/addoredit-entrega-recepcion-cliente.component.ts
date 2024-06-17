import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EState } from 'src/app/core/enums/state.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-entrega-recepcion-cliente',
  templateUrl: './addoredit-entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CrudEntregaRecepcionClienteComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);

  id: number = 0;

  cb_estatus: ISelectItem[] = onGetSelectItemFromEnum(EState);
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    observaciones: [''],
    archivo: [''],
    estatus: [EState.Activo],
  });

  submitting: boolean = false;

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.onLoadData();
  }

  onSubmit() {
    console.log(this.form.value);
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model = this.onCreateFormData(this.form.value);
    this.submitting = true;

    this.apiRequestService
      .onPut(
        `EntregaRecepcionCliente/${this.id}/${
          this.authService.applicationUserId
        }/${this.customerIdService.getCustomerId()}`,
        model
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : (this.submitting = false);
      });
  }
  onLoadData() {
    const urlApi = `EntregaRecepcionDescripcion/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  change(file: any) {
    this.form.patchValue({ archivo: file });
  }
  get f() {
    return this.f.form.controls;
  }

  onCreateFormData(dto: any) {
    let formData = new FormData();
    formData.append('id', String(this.id));
    formData.append('estatus', String(dto.estatus));
    formData.append('userId', dto.userId);
    formData.append('observaciones', String(dto.observaciones));
    if (dto.archivo) {
      formData.append('archivo', dto.archivo);
    }
    return formData;
  }
}
