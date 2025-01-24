import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-inspections-addoredit',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
  templateUrl: './inspections-addoredit.component.html',
})
export default class InspectionsAddoreditComponent implements OnInit {
  fb = inject(FormBuilder);
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerService = inject(CustomerIdService);

  submitting: boolean = false;
  cb_area_responsable: ISelectItem[] = [];
  id: string = this.config.data.id;

  form: FormGroup = this.fb.group(
    {
      id: { value: this.id, disabled: true },
      name: [''],
      departamentId: [0, Validators.required],
      customerId: [this.customerService.customerId, Validators.required],
      departamentName: [''],
      frequency: [0, Validators.required],
      isActive: [true, Validators.required],
      dayOfMonth: [null],
      weeklyDays: this.fb.array([]), // Aquí se almacenan los días seleccionados
    },
    { validators: this.weeklyDaysValidator } // Aplicar la validación personalizada
  );
  get weeklyDays(): FormArray {
    return this.form.get('weeklyDays') as FormArray;
  }
  ngOnInit(): void {
    if (this.id !== '') this.onLoadData();
    this.onLoadSelectItem();
  }

  selectedFrequency: string | null = null;
  weekDays = [
    { label: 'Lunes', value: 1 },
    { label: 'Martes', value: 2 },
    { label: 'Miércoles', value: 3 },
    { label: 'Jueves', value: 4 },
    { label: 'Viernes', value: 5 },
    { label: 'Sábado', value: 6 },
    { label: 'Domingo', value: 0 },
  ];
  selectedWeekDays: string[] = [];
  selectedDayOfMonth: number | null = null;

  onLoadData() {
    const urlApi = `inspection/${this.id}`;
    this.apiRequestService.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);

      // Limpiar el FormArray antes de llenarlo
      const weeklyDaysArray = this.form.get('weeklyDays') as FormArray;
      weeklyDaysArray.clear();

      // Llenar los días seleccionados si la frecuencia es semanal
      if (result.frequency === 'weekly' && result.weeklyDays?.length) {
        result.weeklyDays.forEach((day: number) => {
          weeklyDaysArray.push(new FormControl(day));
        });
      }

      // Validar la frecuencia para mostrar/ocultar opciones
      this.onValidateFrequency(result.frequency);
    });
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value); // Convertir a número

    if (target.checked) {
      if (!this.weeklyDays.value.includes(value)) {
        this.weeklyDays.push(new FormControl(value));
      }
    } else {
      const index = this.weeklyDays.controls.findIndex(
        (ctrl) => ctrl.value === value
      );
      if (index >= 0) {
        this.weeklyDays.removeAt(index);
      }
    }
  }

  onValidateFrequency(frequency: string) {
    // Mostrar/ocultar días de la semana según la frecuencia
    const weeklyDaysArray = this.form.get('weeklyDays') as FormArray;

    if (frequency !== 'weekly') {
      weeklyDaysArray.clear(); // Limpiar si no es semanal
    }
    if (frequency === 'weekly') {
      this.selectedFrequency = 'weekly';
    }

    // Configurar la validación de dayOfMonth según la frecuencia
    const dayOfMonthControl = this.form.get('dayOfMonth');
    if (frequency === 'monthly') {
      dayOfMonthControl?.setValidators([Validators.required]);
    } else {
      dayOfMonthControl?.clearValidators();
      dayOfMonthControl?.reset();
    }
    dayOfMonthControl?.updateValueAndValidity();
  }

  onFrequencyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedFrequency = target.value;

    // Limpiar días seleccionados si no es semanal
    if (this.selectedFrequency !== 'weekly') {
      this.weeklyDays.clear();
    }

    // Configurar la validación de dayOfMonth según la frecuencia
    const dayOfMonthControl = this.form.get('dayOfMonth');
    if (this.selectedFrequency === 'monthly') {
      dayOfMonthControl?.setValidators([Validators.required]);
    } else {
      dayOfMonthControl?.clearValidators();
      dayOfMonthControl?.reset();
    }
    dayOfMonthControl?.updateValueAndValidity();

    // Forzar reevaluación de la validación personalizada
    this.form.updateValueAndValidity();
  }

  onSubmit() {
    this.form.markAllAsTouched(); // Marcar todos los campos como tocados
    this.form.updateValueAndValidity(); // Revalidar el formulario

    if (!this.apiRequestService.validateForm(this.form)) return;

    this.submitting = true;

    if (this.id === '') {
      this.apiRequestService
        .onPost('Inspection', this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    } else {
      this.apiRequestService
        .onPut(`Inspection/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : (this.submitting = false);
        });
    }
  }
  weeklyDaysValidator(control: AbstractControl): ValidationErrors | null {
    const frequency = control.get('frequency')?.value;
    const weeklyDays = control.get('weeklyDays') as FormArray;

    if (frequency === 'weekly' && weeklyDays.length === 0) {
      return { requiredWeeklyDays: true }; // Error si no hay días seleccionados
    }
    return null; // Sin errores
  }

  onLoadSelectItem() {
    this.apiRequestService
      .onGetSelectItem(`ResponsibleArea`)
      .then((response: any) => {
        this.cb_area_responsable = response;
      });
  }
  public saveAreResponsableId(e: any): void {
    let find = this.cb_area_responsable.find(
      (x) => x?.label === e.target.value
    );
    this.form.patchValue({
      departamentId: find?.value,
      departamentName: find?.label,
    });
  }
}
