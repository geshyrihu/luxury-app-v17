import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ComponentsModule from 'app/shared/components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-person-addoredit-address',
  templateUrl: './person-addoredit-address.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    CustomButtonModule,
    CustomInputModule,
    ReactiveFormsModule,
  ],
  providers: [CustomToastService],
})
export default class PersonAddoreditAddressComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dataService = inject(DataService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private customToastService = inject(CustomToastService);

  personId: number = 0;
  addressId: number = 0;

  submitting: boolean = false;
  customerId: number = 0;
  subRef$: Subscription;
  form: FormGroup = this.formBuilder.group({
    id: [],
    country: ['México', Validators.required],
    city: ['', Validators.required],
    district: ['', Validators.required],
    townHall: ['', Validators.required],
    number: ['', Validators.required],
    unitNumber: [],
    street: ['', Validators.required],
    zipCode: ['', Validators.required],
    longitud: [],
    latitud: [],
  });

  ngOnInit(): void {
    this.personId = this.config.data.personId;
    if (this.personId !== 0) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`person/address/${this.personId}`)
      .subscribe({
        next: (resp: any) => {
          this.form.patchValue(resp.body);
          console.log('🚀 ~ resp.body:', resp.body);

          this.addressId = resp.body.id;
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

    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put(`address/${this.addressId}`, this.form.value)
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
