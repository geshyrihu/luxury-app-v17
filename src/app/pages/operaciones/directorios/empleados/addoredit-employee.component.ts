import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { EEducationLevel } from 'src/app/core/enums/education-level.enum';
import { EMaritalStatus } from 'src/app/core/enums/marital.status';
import { ECountry } from 'src/app/core/enums/paises.enum';
import { ESex } from 'src/app/core/enums/sex.enum';
import { EBloodType } from 'src/app/core/enums/tipo-sangre';
import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { IEmployeeAddOrEditDto } from 'src/app/core/interfaces/IEmployeeAddOrEditDto.interface';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { phonePrefixes } from 'src/app/core/interfaces/phone-number-prefix';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SelectItemService,
} from 'src/app/core/services/common-services';
import ComponentsModule, {
  flatpickrFactory,
} from 'src/app/shared/components.module';
import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

@Component({
  selector: 'app-addoredit',
  templateUrl: './addoredit-employee.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    CustomInputModule,
  ],
  providers: [DatePipe, CustomToastService],
})
export default class AddOrEditEmplopyeeComponent implements OnInit, OnDestroy {
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  public authService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public datepipe = inject(DatePipe);

  public ref = inject(DynamicDialogRef);
  public selectItemService = inject(SelectItemService);

  submitting: boolean = false;
  subRef$: Subscription;

  id = 0;

  cb_sex = onGetSelectItemFromEnum(ESex);
  cb_education_level = onGetSelectItemFromEnum(EEducationLevel);
  cb_blood_type = onGetSelectItemFromEnum(EBloodType);
  cb_marital_status = onGetSelectItemFromEnum(EMaritalStatus);
  cb_nationality = ECountry.GetEnum();
  cb_type_contract = onGetSelectItemFromEnum(ETypeContract);

  cb_profession: ISelectItemDto[];
  cb_phonePrefixes: any = phonePrefixes;
  cb_customer: ISelectItemDto[] = [];
  cb_state: ISelectItemDto[] = [];
  model: IEmployeeAddOrEditDto;
  form: FormGroup;

  formDataPersonalId = 0;
  formDataLaboralId = 0;
  ngOnInit(): void {
    this.selectItemService.onGetSelectItem('Professions').subscribe((resp) => {
      this.cb_profession = resp;
    });
    this.selectItemService.onGetSelectItem('Customers').subscribe((resp) => {
      this.cb_customer = resp;
    });

    flatpickrFactory();
    this.id = this.config.data.id;

    if (this.id !== 0) this.onLoadData();

    this.form = this.formBuilder.group({
      id: { value: this.id, disabled: true },
      firstName: [, Validators.required],
      lastName: [, Validators.required],
      active: [],
      address: [],
      birth: [],
      bloodType: [],
      celularPersonal: [, Validators.required],
      correoPersonal: [, Validators.required],
      curp: [],
      customerId: [],
      dateAdmission: [],
      dateCreation: [],
      educationLevel: [],
      localPhone: [],
      maritalStatus: [],
      nationality: [],
      nss: [],
      personId: [],
      phoneNumberPrefix: [],
      photoPath: [],
      professionId: [],
      rfc: [],
      salary: [],
      sex: [],
      typeContract: [],
    });
  }

  submit() {
    this.form.patchValue({
      id: this.id,
    });
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((x) => {
        x.markAllAsTouched();
      });
      return;
    }
    this.submitting = true;
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .put(`Employees/${this.id}`, this.form.value)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.ref.close();
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

  onLoadData() {
    this.subRef$ = this.dataService.get(`Employees/${this.id}`).subscribe({
      next: (resp: any) => {
        this.model = resp.body;
        this.form.patchValue(this.model);
        this.onLoadPrefix(resp.body.phoneNumberPrefix);
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }

  onLoadPrefix(phoneNumberPrefix: string) {
    this.cb_phonePrefixes.find((x) => {
      x?.prefix === phoneNumberPrefix;
      this.form.patchValue({
        phoneNumberPrefix: `${x.country} ${x.prefix}`,
      });
    });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
