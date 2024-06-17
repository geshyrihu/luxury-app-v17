import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IAccount } from 'src/app/core/interfaces/account-dto.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import CardEmployeeComponent from 'src/app/pages/employee/card-employee/card-employee.component';

import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import CreateAccountComponent from '../create-account/create-account.component';
import AddOrEditEmailDataComponent from '../email-data/addoredit-email-data.component';
import MdEditAccountComponent from '../modal-edit-account/modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListAccountComponent implements OnInit {
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);

  cb_customer: ISelectItem[] = [];
  cb_profession: ISelectItem[] = [];
  data: IAccount[] = [];

  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';
  applicationUserState: boolean = true;
  ngOnInit(): void {
    this.onLoadData(true);
  }
  onLoadData(applicationUserState: boolean): void {
    this.apiRequestService
      .onGetList(`ApplicationUser/GetAllAccounts/${applicationUserState}`)
      .then((result: any) => {
        this.data = result;
      });
  }

  onSelectActive(applicationUserState: boolean): any {
    this.applicationUserState = applicationUserState;
    this.onLoadData(applicationUserState);
  }
  onCardEmployee(applicationUserId: number) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onCreateAccount() {
    this.dialogHandlerService
      .openDialog(
        CreateAccountComponent,
        null,
        'Crear Cuenta',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.applicationUserState);
      });
  }
  onModalEmailData(applicationUserId: string) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditEmailDataComponent,
        {
          applicationUserId,
        },
        'Datos de Correo',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.applicationUserState);
      });
  }
  onModalEditAccount(applicationUserId: string, email: string) {
    this.dialogHandlerService
      .openDialog(
        MdEditAccountComponent,
        {
          applicationUserId,
          email,
        },
        'Editar Cuenta',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.applicationUserState);
        }
      });
  }

  onToBlockAccount(applicationUserId: string): void {
    this.apiRequestService
      .onGetList('ApplicationUser/ToBlockAccount/' + applicationUserId)
      .then(() => {
        const registro = this.data.find(
          (item) => item.id === applicationUserId
        );
        // Verifica si se encontró el registro
        if (registro) registro.active = !registro.active; // o cualquier otro valor que desees asignar
      });
  }

  onToUnlockAccount(applicationUserId: string): void {
    this.apiRequestService
      .onGetList('ApplicationUser/ToUnlockAccount/' + applicationUserId)
      .then(() => {
        const registro = this.data.find(
          (item) => item.id === applicationUserId
        );
        // Verifica si se encontró el registro
        if (registro) registro.active = !registro.active; // o cualquier otro valor que desees asignar
      });
  }
  onDelete(applicationUserId: string): void {
    this.apiRequestService
      .onDelete(`ApplicationUser/${applicationUserId}`)
      .then((result: boolean) => {
        if (result)
          this.data = this.data.filter((item) => item.id !== applicationUserId);
      });
  }
}
