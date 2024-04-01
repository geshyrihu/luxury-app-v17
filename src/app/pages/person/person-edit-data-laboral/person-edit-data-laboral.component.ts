import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EEducationLevel } from 'src/app/core/enums/education-level.enum';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-person-edit-data-laboral',
  templateUrl: './person-edit-data-laboral.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class PersonEditDataLaboralComponent implements OnInit {
  private apiRequestService = inject(ApiRequestService);
  private customToastService = inject(CustomToastService);
  dataService = inject(DataService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  employeeId: number = 0;
  personId: number = 0;

  submitting: boolean = false;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  cb_education_level: ISelectItem[] = onGetSelectItemFromEnum(EEducationLevel);
  cb_type_contract: ISelectItem[] = onGetSelectItemFromEnum(ETypeContract);
  cb_state: ISelectItem[] = [
    {
      label: 'Activo',
      value: true,
    },
    {
      label: 'Inactivo',
      value: false,
    },
  ];

  cb_profession: ISelectItem[];
  cb_customer: ISelectItem[] = [];
  // Inicializacion de formulario

  form: FormGroup = this.formBuilder.group({
    id: { value: this.employeeId, disabled: true },
    customerId: ['', Validators.required],
    dateAdmission: ['', Validators.required],
    educationLevel: ['', Validators.required],
    professionId: ['', Validators.required],
    salary: ['', Validators.required],
    typeContract: ['', Validators.required],
    active: ['', Validators.required],
  });

  ngOnInit() {
    this.personId = this.config.data.personId;

    this.apiRequestService
      .onGetSelectItem(`Professions`)
      .then((response: any) => {
        this.cb_profession = response;
      });

    this.apiRequestService
      .onGetSelectItem(`Customers`)
      .then((response: any) => {
        this.cb_customer = response;
      });
    this.employeeId = this.config.data.employeeId;
    if (this.employeeId !== 0) this.onLoadData();
  }

  onLoadData() {
    this.dataService
      .get(`employees/getemployeeid/${this.employeeId}`)
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
    // Metodo para validar el formulario
    this.apiRequestService.validateForm(this.form);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .put(`employees/${this.employeeId}/${this.personId}`, this.form.value)
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
