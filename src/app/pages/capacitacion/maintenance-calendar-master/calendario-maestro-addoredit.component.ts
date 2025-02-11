import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-calendario-maestro-addoredit',
  templateUrl: './calendario-maestro-addoredit.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgSelectModule, CustomInputModule],
  providers: [EnumSelectService],
})
export default class CalendarioMaestroAddOrEditComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  proveedoresSeleccionados: ISelectItem[] = [];
  cb_equipoCalendarioMaestro: ISelectItem[] = [];
  cb_providers: ISelectItem[] = [];
  cb_meses: ISelectItem[] = [];

  id: number = 0;
  submitting: boolean = false;

  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    calendarioMaestroEquipoId: ['', Validators.required],
    descripcionServicio: ['', Validators.required],
    mes: [this.config.data.mes, Validators.required],
    observaciones: [''],
    proveedores: [[]],
  });

  async ngOnInit() {
    this.cb_meses = await this.enumSelectS.month(false);
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData(this.id);
  }

  get f() {
    return this.form.controls;
  }
  onLoadData(id: number) {
    this.apiRequestS
      .onGetItem(`CalendarioMaestro/${id}`)
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          mes: this.config.data.mes,
        });
      });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`CalendarioMaestro`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(`CalendarioMaestro/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  onLoadSelectItem() {
    this.apiRequestS
      .onGetSelectItem('EquipoCalendarioMaestro')
      .then((response: ISelectItem[]) => {
        this.cb_equipoCalendarioMaestro = response;
      });

    this.apiRequestS
      .onGetSelectItem('Providers')
      .then((response: ISelectItem[]) => {
        this.cb_providers = response;
      });
  }
}
