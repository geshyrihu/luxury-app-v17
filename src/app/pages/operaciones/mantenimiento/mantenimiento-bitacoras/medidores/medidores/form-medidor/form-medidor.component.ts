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
import { IMedidorLecturaDto } from 'src/app/core/interfaces/IMedidorLecturaDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
@Component({
  selector: 'app-form-medidor',
  templateUrl: './form-medidor.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class FormMedidorComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  private selectItemService = inject(SelectItemService);
  private customerIdService = inject(CustomerIdService);

  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;

  id: number = 0;
  cb_nombreMedidorCategoria: any[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    medidorActivo: [true],
    fechaRegistro: [''],
    consumoDiarioMaximo: [0, Validators.required],
    medidorCategoriaId: ['', Validators.required],
    numeroMedidor: ['', Validators.required],
    descripcion: ['', Validators.required],
    customerId: [this.customerIdService.customerId],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
  });

  ngOnInit(): void {
    this.onSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onSelectItem() {
    this.selectItemService
      .onGetSelectItem('MedidorCategoria')
      .subscribe((resp) => {
        this.cb_nombreMedidorCategoria = resp;
      });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get<IMedidorLecturaDto>(`Medidor/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
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
        .post(`Medidor`, this.form.value)
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
        .put(`Medidor/${this.id}`, this.form.value)
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
