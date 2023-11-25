import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { cb_ESiNo } from 'src/app/core/enums/si-no.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { EnumService } from 'src/app/core/services/enum-service';
import ComponentsModule from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

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
  private enumService = inject(EnumService);

  submitting: boolean = false;

  // cb_status: ISelectItemDto[] = onGetSelectItemFromEnum(EStatus);
  cb_status: ISelectItemDto[] = [];
  // cb_tipo_baja: ISelectItemDto[] = onGetSelectItemFromEnum(ETypeOfDeparture);
  cb_tipo_baja: ISelectItemDto[] = [];
  cb_si_no: ISelectItemDto[] = cb_ESiNo;

  id: number = 0;
  subRef$: Subscription;
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
    this.enumService
      .onGetSelectItemEmun('ETypeOfDeparture')
      .subscribe((resp) => {
        this.cb_tipo_baja = resp;
      });
    this.enumService
      .onGetSelectItemEmun('EStatus')
      .subscribe((resp) => {
        this.cb_status = resp;
      });

    this.subRef$ = this.dataService
      .get(`RequestDismissal/GetById/${this.id}`)
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
    if (this.id === 0) {
      this.subRef$ = this.dataService
        .post(`RequestDismissal/`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
          },
        });
    } else {
      this.subRef$ = this.dataService
        .put(`RequestDismissal/${this.id}`, this.form.value)
        .subscribe({
          next: () => {
            this.customToastService.onClose();
            this.ref.close(true);
          },
          error: (err) => {
            console.log(err.error);
            this.customToastService.onShowError();
            // Habilitar el botón nuevamente al finalizar el envío del formulario
            this.customToastService.onClose();
            this.submitting = false;
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
  isControlInvalid(control: FormControl) {
    return control.invalid && (control.dirty || control.touched);
  }
  removeDiscountDescription(index: number, id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`RequestDismissalDiscount/${id}`)
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
          this.discounts.removeAt(index);
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  get discounts() {
    return this.form.get('discounts') as FormArray;
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
