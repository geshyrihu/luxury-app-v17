import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-entrega-recepcion-cliente',
  templateUrl: './addoredit-entrega-recepcion-cliente.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class CrudEntregaRecepcionClienteComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  authS = inject(AuthService);
  formBuilder = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  enumSelectService = inject(EnumSelectService);

  id: number = 0;

  cb_estatus: ISelectItem[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    observaciones: [''],
    archivo: [''],
    estatus: [0],
  });

  submitting: boolean = false;

  async ngOnInit() {
    this.cb_estatus = await this.enumSelectService.state();
    this.id = this.config.data.id;
    this.onLoadData();
  }

  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    const model = this.onCreateFormData(this.form.value);
    this.submitting = true;

    this.apiRequestService
      .onPut(
        `EntregaRecepcionCliente/${this.id}/${
          this.authS.applicationUserId
        }/${this.custIdService.getCustomerId()}`,
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
