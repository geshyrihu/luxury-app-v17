import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EMonth } from 'src/app/core/enums/month.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-calendario-maestro-addoredit',
  templateUrl: './calendario-maestro-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgSelectModule, CustomInputModule],
})
export default class CalendarioMaestroAddOrEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  proveedoresSeleccionados: ISelectItem[] = [];
  cb_equipoCalendarioMaestro: ISelectItem[] = [];
  cb_providers: ISelectItem[] = [];
  cb_meses: ISelectItem[] = onGetSelectItemFromEnum(EMonth);

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    calendarioMaestroEquipoId: ['', Validators.required],
    descripcionServicio: ['', Validators.required],
    mes: [this.config.data.mes, Validators.required],
    observaciones: [''],
    proveedores: [[]],
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  get f() {
    return this.form.controls;
  }
  onLoadData(id: number) {
    this.apiRequestService
      .onGetItem(`CalendarioMaestro/${id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          mes: this.config.data.mes,
        });
      });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestService
        .onPost(`CalendarioMaestro`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`CalendarioMaestro/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem('EquipoCalendarioMaestro')
      .then((response: ISelectItem[]) => {
        this.cb_equipoCalendarioMaestro = response;
      });

    this.apiRequestService
      .onGetSelectItem('Providers')
      .then((response: ISelectItem[]) => {
        this.cb_providers = response;
      });
  }
}
