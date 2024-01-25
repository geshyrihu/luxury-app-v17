import { CommonModule } from '@angular/common';
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
import { EEducationLevel } from 'src/app/core/enums/education-level.enum';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

@Component({
  selector: 'app-person-edit-data-laboral',
  templateUrl: './person-edit-data-laboral.component.html',
  standalone: true,
  imports: [
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [CustomToastService],
})
export default class PersonEditDataLaboralComponent implements OnInit {
  private apiRequestService = inject(ApiRequestService);
  private customToastService = inject(CustomToastService);
  private dataService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  employeeId: number = 0;
  personId: number = 0;

  submitting: boolean = false;
  subRef$: Subscription;

  cb_education_level: ISelectItemDto[] =
    onGetSelectItemFromEnum(EEducationLevel);
  cb_type_contract: ISelectItemDto[] = onGetSelectItemFromEnum(ETypeContract);
  cb_state: ISelectItemDto[] = [
    {
      label: 'Activo',
      value: true,
    },
    {
      label: 'Inactivo',
      value: false,
    },
  ];

  cb_profession: ISelectItemDto[];
  cb_customer: ISelectItemDto[] = [];
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
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
    this.selectItemService.onGetSelectItem('Customers').subscribe((resp) => {
      this.cb_customer = resp;
    });
    this.employeeId = this.config.data.employeeId;
    if (this.employeeId !== 0) this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(`employees/getemployeeid/${this.employeeId}`)
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
    this.apiRequestService.onValidateForm(this.form);
    // Deshabilitar el botón al iniciar el envío del formulario
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .put(`employees/${this.employeeId}/${this.personId}`, this.form.value)
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
