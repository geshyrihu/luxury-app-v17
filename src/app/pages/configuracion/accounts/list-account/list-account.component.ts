import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbDropdownModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { IAccountDto } from 'src/app/core/interfaces/account-dto.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
import PhoneFormatPipe from 'src/app/core/pipes/phone-format.pipe';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DataFilterService } from 'src/app/core/services/dataFilter.service';
import ComponentsModule from 'src/app/shared/components.module';
import DropdownRouteComponent from 'src/app/shared/ngb-dropdown-menu/dropdown-route.component';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import CreateAccountComponent from '../create-account/create-account.component';
import AddOrEditEmailDataComponent from '../email-data/addoredit-email-data.component';
import MdEditAccountComponent from '../modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    PrimeNgModule,
    NgbDropdownModule,
    DropdownRouteComponent,
    PhoneFormatPipe,
    NgbTooltip,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class ListAccountComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public customToastService = inject(CustomToastService);
  public dataFilterService = inject(DataFilterService);

  cb_customer: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[] = [];
  data: IAccountDto[] = [];
  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
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
  onCreateAccount() {
    this.ref = this.dialogService.open(CreateAccountComponent, {
      header: 'Crear Cuenta',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }
  onModalEmailData(applicationUserId: string) {
    this.ref = this.dialogService.open(AddOrEditEmailDataComponent, {
      data: {
        applicationUserId: applicationUserId,
      },
      header: 'Datos de Correo',
      styleClass: 'shadow-lg modal-md',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
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

  onLoadData(): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get<IAccountDto[]>(`Accounts/GetAll`)
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
  onDelete(applicationUserId: string): void {
    this.subRef$ = this.dataService
      .delete('Accounts/' + applicationUserId)
      .subscribe({
        next: () => {
          this.customToastService.onShowSuccess();
          this.onLoadData();
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
