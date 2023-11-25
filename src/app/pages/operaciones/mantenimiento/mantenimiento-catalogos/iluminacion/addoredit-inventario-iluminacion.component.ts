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
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';
@Component({
  selector: 'app-addoredit-inventario-iluminacion',
  templateUrl: './addoredit-inventario-iluminacion.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditInventarioIluminacionComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  submitting: boolean = false;
  subRef$: Subscription;
  cb_machinery: ISelectItemDto[] = [];
  cb_producto: ISelectItemDto[] = [];

  id: number = 0;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    machineryId: ['', Validators.required],
    machinery: ['', Validators.required],
    area: ['', Validators.required],
    cantidad: ['', Validators.required],
    productoId: ['', Validators.required],
    producto: ['', Validators.required],
    employeeId: [
      this.authService.userTokenDto.infoEmployeeDto.employeeId,
      Validators.required,
    ],
  });

  ngOnInit(): void {
    this.onLoadProducto();
    this.onLoadMachinery();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  public saveProductoId(e: any): void {
    let find = this.cb_producto.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      productoId: find?.value,
    });
  }
  public saveMachineryId(e: any): void {
    let find = this.cb_machinery.find((x) => x?.label === e.target.value);
    this.form.patchValue({
      machineryId: find?.value,
    });
  }
  onLoadData() {
    this.subRef$ = this.dataService
      .get<any>(`InventarioIluminacion/${this.id}`)
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
    let model = this.form.value;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.id = this.config.data.id;
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`InventarioIluminacion`, model)
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
        .put(`InventarioIluminacion/${this.id}`, model)
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

  onLoadMachinery() {
    this.subRef$ = this.dataService
      .get(
        'Machineries/GetAutocompeteInv/' +
          this.customerIdService.getcustomerId()
      )
      .subscribe({
        next: (resp: any) => {
          this.cb_machinery = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onLoadProducto() {
    this.subRef$ = this.dataService
      .get('Productos/GetAutoCompleteSelectItem/')
      .subscribe({
        next: (resp: any) => {
          this.cb_producto = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
