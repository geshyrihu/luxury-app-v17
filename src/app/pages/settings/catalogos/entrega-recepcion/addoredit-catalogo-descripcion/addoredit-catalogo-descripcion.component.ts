import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-catalogo-descripcion',
  templateUrl: './addoredit-catalogo-descripcion.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddOrEditCatalogoDescripcionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting: boolean = false;

  id: number = 0;

  cb_area_responsable: ISelectItem[] = [
    { value: 'CONTABLE', label: 'CONTABLE' },
    { value: 'OPERACIONES', label: ' OPERACIONES' },
    { value: 'JURIDICO', label: 'JURIDICO' },
    { value: 'MANTENIMIENTO', label: 'MANTENIMIENTO' },
  ];

  cb_grupo: ISelectItem[] = [];
  cb_state: ISelectItem[] = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' },
  ];
  form: FormGroup = this.formB.group({
    id: { value: this.id, disabled: true },
    folioId: ['', Validators.required],
    departamento: ['', Validators.required],
    state: [Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(4)]],
    grupo: ['', [Validators.required, Validators.minLength(4)]],
  });

  ngOnInit(): void {
    this.onLoadGrupos();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `CatalogoEntregaRecepcionDescripcion/${this.id}`;
    this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
      this.form.patchValue(responseData);
    });
  }
  onLoadGrupos() {
    const urlApi = `CatalogoEntregaRecepcionDescripcion/grupos`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.cb_grupo = responseData;
    });
  }
  onSubmit() {
    if (!this.apiRequestS.validateForm(this.form)) return;
    this.id = this.config.data.id;

    this.submitting = true;

    if (this.id === 0) {
      this.apiRequestS
        .onPost(`CatalogoEntregaRecepcionDescripcion`, this.form.value)
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestS
        .onPut(
          `CatalogoEntregaRecepcionDescripcion/${this.id}`,
          this.form.value
        )
        .then((responseData: boolean) => {
          responseData ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
}
