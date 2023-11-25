import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IAccountDto } from 'src/app/core/interfaces/account-dto.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import DropdownRouteComponent from 'src/app/shared/ngb-dropdown-menu/dropdown-route.component';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import TableHeaderComponent from 'src/app/shared/table-header/table-header.component';
import { environment } from 'src/environments/environment';
import MdEditAccountComponent from '../modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-account-customer',
  templateUrl: './account-customer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    DropdownRouteComponent,
    PhoneFormatPipe,
    TableHeaderComponent,
    PrimeNgModule,
    NgbDropdownModule,
    ComponentsModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class AccountCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData(): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IAccountDto[]>(
        `Accounts/GetAll/${this.customerIdService.getcustomerId()}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModalEditAccount(applicationUserId: string, email: string) {
    this.ref = this.dialogService.open(MdEditAccountComponent, {
      data: {
        applicationUserId: applicationUserId,
        email: email,
      },
      header: 'Editar Cuenta',
      width: '100%',
      height: '100%',
      styleClass: 'shadow-lg',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      this.customToastService.onShowSuccess();
      this.onLoadData();
    });
  }

  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Colaborador',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  onToBlockAccount(applicationUserId: string): void {
    this.subRef$ = this.dataService
      .get('Accounts/ToBlockAccount/' + applicationUserId)
      .subscribe({
        next: () => {
          const registro = this.data.find(
            (item) => item.id === applicationUserId
          );
          // Verifica si se encontró el registro
          if (registro) {
            // Modifica la propiedad 'active'
            registro.active = !registro.active; // o cualquier otro valor que desees asignar
          } else {
            console.log(
              'No se encontró el registro con el ID:',
              applicationUserId
            );
          }
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }

  onToUnlockAccount(applicationUserId: string): void {
    this.subRef$ = this.dataService
      .get('Accounts/ToUnlockAccount/' + applicationUserId)
      .subscribe({
        next: (resp: any) => {
          // this.onLoadData();
          // Encuentra el registro por su 'id'
          const registro = this.data.find(
            (item) => item.id === applicationUserId
          );

          // Verifica si se encontró el registro
          if (registro) {
            // Modifica la propiedad 'active'
            registro.active = !registro.active; // o cualquier otro valor que desees asignar
          } else {
            console.log(
              'No se encontró el registro con el ID:',
              applicationUserId
            );
          }
          this.customToastService.onShowSuccess();
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
