// import { Component, OnInit, inject } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { EStatusTask } from 'src/app/core/enums/estatus-task.enum';
// import { EPriority } from 'src/app/core/enums/priority.enum';
// import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
// import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
// import { ApiRequestService } from 'src/app/core/services/api-request.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { DateService } from 'src/app/core/services/date.service';
// import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';

// @Component({
//   selector: 'app-addoredit-ticket-sistemas',
//   templateUrl: './addoredit-ticket-sistemas.component.html',
//   standalone: true,
//   imports: [LuxuryAppComponentsModule, CustomInputModule],
// })
// export default class AddoreditTicketSistemasComponent implements OnInit {
//   apiRequestS = inject(ApiRequestService);

//   authS = inject(AuthService);
//   formB = inject(FormBuilder);
//   config = inject(DynamicDialogConfig);
//   ref = inject(DynamicDialogRef);
//   dateS = inject(DateService);
//   model: any;
//   submitting: boolean = false;

//   id: any = 0;

//   cb_status = onGetSelectItemFromEnum(EStatusTask);
//   cb_priority: ISelectItem[] = onGetSelectItemFromEnum(EPriority);
//   cb_user: ISelectItem[] = [];
//   cb_responsableSistemas: ISelectItem[] = [];
//   form = this.formB.group({
//     id: { value: this.id, disabled: true },
//     activity: ['', Validators.required],
//     dateFinished: [],
//     dateRequest: ['', Validators.required],
//     observations: [''],
//     priority: [0, Validators.required],
//     status: [this.config.data.status, Validators.required],
//     applicationUserResponsableId: [
//       this.authS.applicationUserId,
//       Validators.required,
//     ],
//     applicationUserCargoReporteId: ['', Validators.required],
//     applicationUserCargoReporte: ['', Validators.required],
//   });

//   ngOnInit(): void {
//     this.onLoadSelectItem();
//     this.id = this.config.data.id;
//     if (this.id !== 0) {
//       this.loadData(this.id);
//     }
//   }

//   public saveUserId(e: any): void {
//     let find = this.cb_user.find((x) => x?.label === e.target.value);
//     this.form.patchValue({
//       applicationUserCargoReporteId: find?.value,
//     });
//   }
//   onLoadSelectItem() {
//     this.apiRequestService
//       .onGetSelectItem('AplicationUser')
//       .then((responseData: any) => {
//         this.cb_user = responseData ;
//       });
//     this.apiRequestService
//       .onGetSelectItem(`responsableSistemas`)
//       .then((response: any) => {
//         this.cb_responsableSistemas = response;
//       });
//   }

//   loadData(id: number) {
//     const urlApi = `TicketsSistemas/${id}`;
//     this.apiRequestS.onGetItem(urlApi).then((responseData: any) => {
//       this.form.patchValue(responseData);
//     });
//   }

//   onSubmit() {
//     if (!this.apiRequestS.validateForm(this.form)) return;
//     this.submitting = true;
//     if (this.id === 0) {
//       this.apiRequestService
//         .onPost(`TicketsSistemas`, this.form.value)
//         .then((responseData: boolean) => {
//           responseData ? this.ref.close(true) : (this.submitting = false);
//         });
//     } else {
//       this.apiRequestService
//         .onPut(`TicketsSistemas/${this.id}`, this.form.value)
//         .then((responseData: boolean) => {
//           responseData ? this.ref.close(true) : (this.submitting = false);
//         });
//     }
//   }
// }
