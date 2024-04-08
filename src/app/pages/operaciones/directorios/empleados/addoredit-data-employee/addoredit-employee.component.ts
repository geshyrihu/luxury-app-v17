// import { DatePipe } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import LuxuryAppComponentsModule, {
//   flatpickrFactory,
// } from 'app/shared/luxuryapp-components.module';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Subject, takeUntil } from 'rxjs';
// import { phonePrefixes } from 'src/app/core/conts/phone-number-prefix';
// import { EEducationLevel } from 'src/app/core/enums/education-level.enum';
// import { EMaritalStatus } from 'src/app/core/enums/marital.status';
// import { ECountry } from 'src/app/core/enums/paises.enum';
// import { ESex } from 'src/app/core/enums/sex.enum';
// import { EBloodType } from 'src/app/core/enums/tipo-sangre';
// import { ETypeContract } from 'src/app/core/enums/type-contract.enum';
// import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
// import { IEmployeeAddOrEdit } from 'src/app/core/interfaces/employee-add-or-edit.interface';
// import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
// import { ApiRequestService } from 'src/app/core/services/api-request.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { CustomToastService } from 'src/app/core/services/custom-toast.service';
// import { CustomerIdService } from 'src/app/core/services/customer-id.service';
// import { DataService } from 'src/app/core/services/data.service';
// import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

// @Component({
//   selector: 'app-addoredit',
//   templateUrl: './addoredit-employee.component.html',
//   standalone: true,
//   imports: [LuxuryAppComponentsModule, CustomInputModule],
//   providers: [DatePipe],
// })
// export default class AddOrEditEmplopyeeComponent implements OnInit, OnDestroy {
//   customToastService = inject(CustomToastService);
//   apiRequestService = inject(ApiRequestService);
//   formBuilder = inject(FormBuilder);
//   authService = inject(AuthService);
//   config = inject(DynamicDialogConfig);
//   customerIdService = inject(CustomerIdService);
//   dataService = inject(DataService);
//   datepipe = inject(DatePipe);
//   ref = inject(DynamicDialogRef);

//   id = 0;
//   submitting: boolean = false;

//   private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

//   cb_sex = onGetSelectItemFromEnum(ESex);
//   cb_education_level = onGetSelectItemFromEnum(EEducationLevel);
//   cb_blood_type = onGetSelectItemFromEnum(EBloodType);
//   cb_marital_status = onGetSelectItemFromEnum(EMaritalStatus);
//   cb_nationality = ECountry.GetEnum();
//   cb_type_contract = onGetSelectItemFromEnum(ETypeContract);

//   cb_profession: ISelectItem[];
//   cb_phonePrefixes: any = phonePrefixes;
//   cb_customer: ISelectItem[] = [];
//   cb_state: ISelectItem[] = [];
//   model: IEmployeeAddOrEdit;
//   form: FormGroup;

//   formDataPersonalId = 0;
//   formDataLaboralId = 0;
//   ngOnInit(): void {
//     this.apiRequestService
//       .onGetSelectItem(`Professions`)
//       .then((response: any) => {
//         this.cb_profession = response;
//       });

//     this.apiRequestService
//       .onGetSelectItem(`Customers`)
//       .then((response: any) => {
//         this.cb_customer = response;
//       });
//     flatpickrFactory();
//     this.id = this.config.data.id;

//     if (this.id !== 0) this.onLoadData();

//     this.form = this.formBuilder.group({
//       id: { value: this.id, disabled: true },
//       firstName: [, Validators.required],
//       lastName: [, Validators.required],
//       active: [],
//       address: [],
//       birth: [],
//       bloodType: [],
//       celularPersonal: [, Validators.required],
//       correoPersonal: [, Validators.required],
//       curp: [],
//       customerId: [],
//       dateAdmission: [],
//       dateCreation: [],
//       educationLevel: [],
//       localPhone: [],
//       maritalStatus: [],
//       nationality: [],
//       nss: [],
//       personId: [],
//       phoneNumberPrefix: [],
//       photoPath: [],
//       professionId: [],
//       rfc: [],
//       salary: [],
//       sex: [],
//       typeContract: [],
//     });
//   }

//   submit() {
//     this.form.patchValue({
//       id: this.id,
//     });
//     if (!this.apiRequestService.validateForm(this.form)) return;
//     this.submitting = true;
//     // Mostrar un mensaje de carga
//     this.customToastService.onLoading();
//     this.dataService
//       .put(`Employees/${this.id}`, this.form.value)
//       .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
//       .subscribe({
//         next: () => {
//           this.submitting = false;
//           this.ref.close();
//           this.customToastService.onClose();
//         },
//         error: (error) => {
//           // Habilitar el botón nuevamente al finalizar el envío del formulario
//           this.submitting = false;
//           this.customToastService.onCloseToError(error);
//         },
//       });
//   }

//   onLoadData() {
//     this.dataService
//       .get(`Employees/${this.id}`)
//       .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
//       .subscribe({
//         next: (resp: any) => {
//           this.model = resp.body;
//           this.form.patchValue(this.model);
//           this.onLoadPrefix(resp.body.phoneNumberPrefix);
//         },
//         error: (error) => {
//           this.customToastService.onCloseToError(error);
//         },
//       });
//   }

//   onLoadPrefix(phoneNumberPrefix: string) {
//     this.cb_phonePrefixes.find((x) => {
//       x?.prefix === phoneNumberPrefix;
//       this.form.patchValue({
//         phoneNumberPrefix: `${x.country} ${x.prefix}`,
//       });
//     });
//   }

//   ngOnDestroy(): void {
//     this.dataService.ngOnDestroy();
//   }
// }
