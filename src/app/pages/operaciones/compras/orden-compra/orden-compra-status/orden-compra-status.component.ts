import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-orden-compra-status',
  templateUrl: './orden-compra-status.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class OrdenCompraStatusComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  ordenCompraId: number = 0;
  ordenCompraStatus: any;
  form: FormGroup = this.formBuilder.group({
    id: [0],
    ordenCompraId: [0],
    sePago: [false],
    seRecibio: [false],
    recibidoPor: [''],
    factura: [''],
  });

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`OrdenCompraStatus/${this.ordenCompraId}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.ordenCompraStatus = resp.body;
          this.form.patchValue(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onSubmit() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    this.dataService
      .put(`OrdenCompraStatus/${this.ordenCompraStatus.id}`, this.form.value)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.ref.close(true);
          this.customToastService.onCloseToSuccess();
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
