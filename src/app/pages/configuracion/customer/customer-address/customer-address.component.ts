import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CustomerAddressAddOrEditDto } from 'src/app/core/interfaces/CustomerAddressAddOrEditDto';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import ComponentsModule from 'src/app/shared/components.module';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CustomButtonModule,
    CustomInputModule,
    ReactiveFormsModule,
  ],
  providers: [CustomToastService],
})
export default class CustomerAddressComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  submitting: boolean = false;
  customerId: number = 0;

  form: FormGroup = this.formBuilder.group({
    id: [],
    customerId: ['', Validators.required],
    additionalDetails: [''],
    city: ['', Validators.required],
    district: ['', Validators.required],
    country: ['', Validators.required],
    latitud: ['', Validators.required],
    longitud: ['', Validators.required],
    number: ['', Validators.required],
    postalCode: ['', Validators.required],
    street: ['', Validators.required],
    townHall: ['', Validators.required],
    unitNumber: [],
  });
  ngOnInit(): void {
    this.customerId = this.config.data.customerId;
    if (this.customerId !== 0) this.onLoadData();
  }
  onLoadData() {
    this.dataService
      .get<CustomerAddressAddOrEditDto>(
        `customers/customeraddress/${this.customerId}`
      )
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

    this.dataService
      .put<CustomerAddressAddOrEditDto>(
        `customers/updatecustomeraddress`,
        this.form.value
      )
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
