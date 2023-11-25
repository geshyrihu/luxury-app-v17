import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-catalogo-descripcion',
  templateUrl: './addoredit-catalogo-descripcion.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddOrEditCatalogoDescripcionComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public config = inject(DynamicDialogConfig);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;

  id: number = 0;
  subRef$: Subscription;
  cb_area_responsable: ISelectItemDto[] = [
    { value: 'CONTABLE', label: 'CONTABLE' },
    { value: 'OPERACIONES', label: ' OPERACIONES' },
    { value: 'JURIDICO', label: 'JURIDICO' },
    { value: 'MANTENIMIENTO', label: 'MANTENIMIENTO' },
  ];

  cb_grupo: ISelectItemDto[] = [];
  cb_state: ISelectItemDto[] = [
    { value: 1, label: 'Activo' },
    { value: 0, label: 'Inactivo' },
  ];
  form: FormGroup = this.formBuilder.group({
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
    this.subRef$ = this.dataService
      .get(`CatalogoEntregaRecepcionDescripcion/${this.id}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onLoadGrupos() {
    this.subRef$ = this.dataService
      .get(`CatalogoEntregaRecepcionDescripcion/grupos`)
      .subscribe({
        next: (resp: any) => {
          this.cb_grupo = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onSubmit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`CatalogoEntregaRecepcionDescripcion`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`CatalogoEntregaRecepcionDescripcion/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (err) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            // En caso de error, mostrar un mensaje de error y registrar el error en la consola
            this.customToastService.onCloseToError();
            console.log(err.error);
          },
        });
    }
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
