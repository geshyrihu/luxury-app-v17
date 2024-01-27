import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { EStatus } from 'src/app/core/enums/status.enum';
import { ETypeOfDeparture } from 'src/app/core/enums/type-of-departure.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-addoredit-solicitud-baja',
  templateUrl: './addoredit-solicitud-baja.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class AddoreditSolicitudBajaComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;

  cb_status: ISelectItemDto[] = onGetSelectItemFromEnum(EStatus);
  cb_tipo_baja: ISelectItemDto[] = onGetSelectItemFromEnum(ETypeOfDeparture);
  cb_si_no: ISelectItemDto[] = cb_ESiNo;

  id: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    reasonForLeaving: [],
    tipoBaja: [],
    executionDate: [],
    lawyerAssistance: [],
    employeeInformed: [],
    status: [],
    discounts: this.formBuilder.array([]),
    applicationUserId: [],
    employeeId: [],
    folio: [],
    requestDate: [],
    workPositionId: [],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get(`RequestDismissal/GetById/${this.id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);

          // Luego, recorre el arreglo de discounts y agrégalo al formArray 'discounts'
          resp.body.discounts.forEach((discount: any) => {
            this.discounts.push(
              this.formBuilder.group({
                description: discount.description,
                discount: discount.discount,
                id: discount.id,
              })
            );
          });
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onSubmit() {
    if (!this.dataService.validateForm(this.form)) return;

    this.id = this.config.data.id;
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    if (this.id === 0) {
      this.dataService
        .post(`RequestDismissal/`, this.form.value)
        .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    } else {
      this.dataService
        .put(`RequestDismissal/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (error) => {
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.submitting = false;
            this.customToastService.onCloseToError(error);
          },
        });
    }
  }

  addDiscountDescription() {
    const discountDescription = this.formBuilder.group({
      description: ['', Validators.required],
      discount: ['', Validators.required],
      id: ['', Validators.required],
    });
    this.discounts.push(discountDescription);
  }
  // isControlInvalid(control: FormControl) {
  //   return control.invalid && (control.dirty || control.touched);
  // }

  isControlInvalid(control: AbstractControl | null): boolean {
    if (control instanceof FormControl) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  removeDiscountDescription(index: number, id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .delete(`RequestDismissalDiscount/${id}`)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.discounts.removeAt(index);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  get discounts() {
    return this.form.get('discounts') as FormArray;
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
