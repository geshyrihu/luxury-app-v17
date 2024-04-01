import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit-inventario-pintura',
  templateUrl: './addoredit-inventario-pintura.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class AddoreditInventarioPinturaComponent
  implements OnInit, OnDestroy
{
  formBuilder = inject(FormBuilder);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  cb_machinery: ISelectItem[] = [];
  cb_producto: ISelectItem[] = [];
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
    this.dataService
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
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    if (this.id === 0) {
      this.dataService
        .post(`InventarioPintura`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`InventarioPintura/${this.id}`, model)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.ref.close(true);
            this.customToastService.onClose();
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }
  onLoadMachinery() {
    this.dataService
      .get(
        'Machineries/GetAutocompeteInv/' +
          this.customerIdService.getcustomerId()
      )
      .subscribe((resp: any) => {
        this.cb_machinery = resp.body;
      });
  }
  onLoadProducto() {
    this.dataService
      .get('Productos/GetAutoCompleteSelectItem/')
      .subscribe((resp: any) => {
        this.cb_producto = resp.body;
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
