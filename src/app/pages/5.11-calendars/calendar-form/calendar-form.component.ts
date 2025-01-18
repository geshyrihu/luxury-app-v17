import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-calendar-form',
  standalone: true,
  templateUrl: './calendar-form.component.html',
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class CalendarFormComponent {
  apiRequestService = inject(ApiRequestService);
  formBuilder = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = '';
  submitting: boolean = false;

  cb_customers: ISelectItem[] = [];

  form: FormGroup = this.formBuilder.group({
    id: { value: this.id, disabled: true },
    name: ['', [Validators.required]],
    description: ['', [Validators.required], ,],
    customers: this.formBuilder.array([]), // FormArray para almacenar IDs de clientes seleccionados
  });
  // Getter para facilitar el acceso al FormArray
  get customersArray(): FormArray {
    return this.form.get('customers') as FormArray;
  }
  ngOnInit(): void {
    // Carga de listado de clientes
    this.apiRequestService
      .onGetSelectItem('CustomersActive')
      .then((resp: any) => {
        this.cb_customers = resp;
      });
    this.id = this.config.data.id;
    if (this.id !== '') this.onLoadData();
  }
  onLoadData() {
    const urlApi = `Calendars/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);

      // Cargar los CustomerId en el FormArray
      result.customers.forEach((customerId: number) => {
        this.customersArray.push(new FormControl(customerId));
      });
    });
  }
  onSubmit() {
    if (!this.apiRequestService.validateForm(this.form)) return;
    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost(`Calendars`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Calendars/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }

  // Método para actualizar la lista de clientes seleccionados
  onCustomerChange(customerId: number, isChecked: boolean) {
    const customersFormArray = this.customersArray;
    if (isChecked) {
      customersFormArray.push(new FormControl(customerId));
    } else {
      const index = customersFormArray.controls.findIndex(
        (x) => x.value === customerId
      );
      customersFormArray.removeAt(index);
    }
  }
}
