import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { SelectItemService } from 'src/app/core/services/select-item.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-edit-detalle',
  templateUrl: './orden-compra-edit-detalle.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraEditDetalleComponent
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  public dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public selectItemService = inject(SelectItemService);
  public customToastService = inject(CustomToastService);
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  id: number = 0;

  cb_unidadMedida: any[] = [];
  form: FormGroup = this.formBuilder.group({
    id: { value: this.config.data.id, disabled: true },
    ordenCompraId: ['', Validators.required],
    productoId: ['', Validators.required],
    cantidad: ['', Validators.required],
    unidadMedidaId: ['', Validators.required],
    precio: ['', Validators.required],
    descuento: ['', Validators.required],
    ivaAplicado: ['', Validators.required],
  });

  ngOnInit(): void {
    this.onSelectItem();
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }

  onSelectItem() {
    this.selectItemService
      .onGetSelectItem('getMeasurementUnits')
      .subscribe((resp) => {
        this.cb_unidadMedida = resp;
      });
  }

  onLoadData() {
    this.dataService
      .get(`OrdenCompraDetalle/${this.id}`)
      .subscribe((resp: any) => {
        this.form.patchValue(resp.body);
      });
  }
  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    this.id = this.config.data.id;

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .put(`OrdenCompraDetalle/${this.id}`, this.form.value)
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
