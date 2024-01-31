import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-edit-productos-almacen',
  templateUrl: './edit-productos-almacen.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EditProductosAlmacenComponent
  implements OnInit, OnDestroy
{
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private selectListSevice = inject(SelectItemService);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public ref = inject(DynamicDialogRef);
  private customToastService = inject(CustomToastService);
  public apiRequestService = inject(ApiRequestService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: any = 0;
  cb_measurementUnits: any = [];
  // stokMaximo: 0;
  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    customerId: [this.customerIdService.customerId, Validators.required],
    productoId: ['', Validators.required],
    producto: [''],
    existencia: [0, Validators.required],
    unidadDeMedidaId: ['', Validators.required],
    stockMin: [0, Validators.required],
    stockMax: [0, Validators.required],
    employeeId: [this.authService.userTokenDto.infoEmployeeDto.employeeId],
  });

  onLoadProducts() {
    this.selectListSevice
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_measurementUnits = resp;
      });
  }

  ngOnInit(): void {
    this.onLoadProducts();
    this.id = this.config.data.id;

    if (this.id !== 0) this.onLoadData();
  }

  // convenience getter for easy access to form fields

  onLoadData() {
    this.dataService
      .get(`InventarioProducto/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    if (this.id === 0) {
      this.dataService
        .post(`InventarioProducto/`, this.form.value)
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
        .put(`InventarioProducto/${this.id}`, this.form.value)
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
