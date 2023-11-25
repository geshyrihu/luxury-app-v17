// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { CustomToastService } from 'src/app/core/services/custom-toast.service';
// import { DataService } from 'src/app/core/services/data.service';
// import { DateService } from 'src/app/core/services/date.service';
// import { SelectItemService } from 'src/app/core/services/select-item.service';
// import ComponentsModule from 'src/app/shared/components.module';
// import CustomInputModule from 'src/app/shared/custom-input-form/custom-input.module';

// @Component({
//   selector: 'app-addoredit',
//   templateUrl: './addoredit.component.html',
//   standalone: true,
//   imports: [ReactiveFormsModule, ComponentsModule, CustomInputModule],
// })
// export default class AddoreditBudgetCardComponent implements OnInit, OnDestroy {
//   private formBuilder = inject(FormBuilder);
//   public authService = inject(AuthService);
//   private dataService = inject(DataService);
//   private dateService = inject(DateService);
//   public config = inject(DynamicDialogConfig);
//   public ref = inject(DynamicDialogRef);
//   private selectItemService = inject(SelectItemService);
//   private customToastService = inject(CustomToastService);

//   submitting: boolean = false;

//   onLoadSelectItem() {
//     this.selectItemService
//       .onGetSelectItem('customers')
//       .subscribe((items: ISelectItemDto[]) => {
//         this.cb_customer = items;
//       });
//   }

//   applicationUserId: string = '';
//   id: any = 0;
//   form: FormGroup;
//   cb_customer: any[] = [];

//   ngOnInit(): void {
//     this.onLoadSelectItem();
//     this.applicationUserId =
//       this.authService.userTokenDto.infoUserAuthDto.applicationUserId;
//     this.id = this.config.data.id;
//     if (this.id !== 0) {
//       this.loadItem();
//     }

//     this.form = this.formBuilder.group({
//       id: { value: this.id, disabled: true },
//       anio: [this.dateService.getFullYear(), Validators.required],
//       customerId: ['', Validators.required],
//       applicationUserId: [this.applicationUserId],
//     });
//   }

//   onSubmit() {
//     const budgetCardDTO: any = this.form.value;
//     if (this.form.invalid) {
//       Object.values(this.form.controls).forEach((x) => {
//         x.markAllAsTouched();
//       });
//       return;
//     }

//     // Deshabilitar el botón al iniciar el envío del formulario
//     this.submitting = true;
//     // Mostrar un mensaje de carga
//     this.customToastService.onLoading();

//     if (this.id === 0) {
//       this.subRef$ = this.dataService
//         .post(`CedulaPresupuestal`, budgetCardDTO)
//         .subscribe({
//           next: () => {
//             this.customToastService.onClose();
//             this.ref.close(true);
//           },
//           error: (err) => {
//             console.log(err.error);
//             this.customToastService.onShowError();
//             // Habilitar el botón nuevamente al finalizar el envío del formulario
//             this.customToastService.onClose();
//             this.submitting = false;
//           },
//         });
//     } else {
//       this.subRef$ = this.dataService
//         .put(`CedulaPresupuestal/${this.id}`, budgetCardDTO)
//         .subscribe({
//           next: () => {
//             this.customToastService.onClose();
//             this.ref.close(true);
//           },
//           error: (err) => {
//             console.log(err.error);
//             this.customToastService.onShowError();
//             // Habilitar el botón nuevamente al finalizar el envío del formulario
//             this.customToastService.onClose();
//             this.submitting = false;
//           },
//         });
//     }
//   }
//   loadItem() {
//     this.subRef$ = this.dataService
//       .get(`CedulaPresupuestal/${this.id}`)
//       .subscribe({
//         next: (resp) => {
//           this.form.patchValue(resp.body);
//         },
//         error: (err) => {
//           this.customToastService.onShowError();
//           console.log(err.error);
//         },
//       });
//   }
//   ngOnDestroy() {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
