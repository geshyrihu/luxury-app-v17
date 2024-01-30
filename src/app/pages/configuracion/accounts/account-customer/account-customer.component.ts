// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { MessageService } from 'primeng/api';
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Observable, Subject, takeUntil } from 'rxjs';
// import { IAccountDto } from 'src/app/core/interfaces/account-dto.interface';
// import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
// import {
//   CustomToastService,
//   CustomerIdService,
//   DataService,
// } from 'src/app/core/services/common-services';
// import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
// import ComponentsModule from 'src/app/shared/components.module';
// import DropdownRouteComponent from 'src/app/shared/ngb-dropdown-menu/dropdown-route.component';
// import PrimeNgModule from 'src/app/shared/prime-ng.module';
// import TableHeaderComponent from 'src/app/shared/table-header/table-header.component';
// import { environment } from 'src/environments/environment';
// import MdEditAccountComponent from '../modal-edit-account/md-edit-account.component';
// @Component({
//   selector: 'app-account-customer',
//   templateUrl: './account-customer.component.html',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ComponentsModule,
//     DropdownRouteComponent,
//     NgbDropdownModule,
//     PhoneFormatPipe,
//     PrimeNgModule,
//     TableHeaderComponent,
//   ],
//   providers: [DialogService, MessageService, CustomToastService],
// })
// export default class AccountCustomerComponent implements OnInit, OnDestroy {
//   private dataService = inject(DataService);
//   public customerIdService = inject(CustomerIdService);
//   public dialogService = inject(DialogService);
//   public messageService = inject(MessageService);
//   public customToastService = inject(CustomToastService);

//   data: any[] = [];
//   ref: DynamicDialogRef;

//   private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

//   customerId$: Observable<number> = this.customerIdService.getCustomerId$();
//   urlImgApi = environment.base_urlImg + 'Administration/accounts/';

//   ngOnInit() {
//     this.onLoadData();
//     this.customerId$.subscribe(() => {
//       this.onLoadData();
//     });
//   }

//   onLoadData(): void {
//     // Mostrar un mensaje de carga
//     this.customToastService.onLoading();
//     this.dataService
//       .get<IAccountDto[]>(
//         `Accounts/GetAll/${this.customerIdService.getcustomerId()}`
//       )
//       .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
//       .subscribe({
//         next: (resp: any) => {
//           this.data = this.customToastService.onCloseOnGetData(resp.body);
//         },
//         error: (error) => {
//           this.customToastService.onCloseToError(error);
//         },
//       });
//   }

//   onModalEditAccount(applicationUserId: string, email: string) {
//     this.ref = this.dialogService.open(MdEditAccountComponent, {
//       data: {
//         applicationUserId: applicationUserId,
//         email: email,
//       },
//       header: 'Editar Cuenta',
//       width: '100%',
//       height: '100%',
//       styleClass: 'shadow-lg',
//       contentStyle: { overflow: 'auto' },
//       baseZIndex: 10000,
//       closeOnEscape: true,
//     });
//     this.ref.onClose.subscribe((resp: boolean) => {
//       this.customToastService.onShowSuccess();
//       this.onLoadData();
//     });
//   }

//   onCardEmployee(employeeId: number) {
//     this.ref = this.dialogService.open(CardEmployeeComponent, {
//       data: {
//         employeeId,
//       },
//       header: 'Colaborador',
//       styleClass: 'modal-sm',
//       closeOnEscape: true,
//       baseZIndex: 10000,
//     });
//   }

//   onToBlockAccount(applicationUserId: string): void {
//     this.dataService
//       .get('Accounts/ToBlockAccount/' + applicationUserId)
//       .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
//       .subscribe({
//         next: () => {
//           const registro = this.data.find(
//             (item) => item.id === applicationUserId
//           );
//           // Verifica si se encontró el registro
//           if (registro) {
//             // Modifica la propiedad 'active'
//             registro.active = !registro.active; // o cualquier otro valor que desees asignar
//           }
//           this.customToastService.onShowSuccess();
//         },
//         error: (error) => {
//           this.customToastService.onCloseToError(error);
//         },
//       });
//   }

//   onToUnlockAccount(applicationUserId: string): void {
//     this.dataService
//       .get('Accounts/ToUnlockAccount/' + applicationUserId)
//       .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
//       .subscribe({
//         next: () => {
//           // Encuentra el registro por su 'id'
//           const registro = this.data.find(
//             (item) => item.id === applicationUserId
//           );

//           // Verifica si se encontró el registro
//           if (registro) {
//             // Modifica la propiedad 'active'
//             registro.active = !registro.active; // o cualquier otro valor que desees asignar
//           }
//           this.customToastService.onShowSuccess();
//         },
//         error: (error) => {
//           this.customToastService.onCloseToError(error);
//         },
//       });
//   }
//   ngOnDestroy(): void {
//     this.dataService.ngOnDestroy();
//   }
// }
