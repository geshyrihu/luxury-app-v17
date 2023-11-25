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
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-inventario-pintura',
  templateUrl: './addoredit-inventario-pintura.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditInventarioPinturaComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
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
    productoId: ['', Validators.required],
    producto: ['', Validators.required],
  });

  ngOnInit(): void {
    this.onLoadMachinery();
    this.onLoadProducto();
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
      .get<any>(`InventarioPintura/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);

        this.form.patchValue({
          productoId: resp.body.productoId,
        });
        this.form.patchValue({
          producto: resp.body.producto,
        });
        this.form.patchValue({
          machineryId: resp.body.machineryId,
        });
        this.form.patchValue({
          machinery: resp.body.machinery,
        });
      });
  }
  onSubmit() {
    let model = this.form.value;
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
        .post(`InventarioPintura`, model)
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
        .put(`InventarioPintura/${this.id}`, model)
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
      .subscribe((resp: any) => {
        this.cb_machinery = resp.body;
      });
  }
  onLoadProducto() {
    this.subRef$ = this.dataService
      .get('Productos/GetAutoCompleteSelectItem/')
      .subscribe((resp: any) => {
        this.cb_producto = resp.body;
      });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
