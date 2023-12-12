import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
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

  submitting: boolean = false;
  customerId: number = 0;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get<CustomerAddressAddOrEditDto>(
        `customers/customeraddress/${this.customerId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          console.log('🚀 ~ resp.body:', resp.body);
          console.log('🚀 ~ formulario:', this.form.value);
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onSubmit() {
    console.log('🚀 ~ this.form.value:', this.form.value);

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put<CustomerAddressAddOrEditDto>(
        `customers/updatecustomeraddress`,
        this.form.value
      )
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
