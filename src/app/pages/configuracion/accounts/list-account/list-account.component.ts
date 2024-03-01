import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ISelectItemDto } from 'src/app/core/interfaces/ISelectItemDto.interface';
import { IAccountDto } from 'src/app/core/interfaces/account-dto.interface';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';

import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import CreateAccountComponent from '../create-account/create-account.component';
import AddOrEditEmailDataComponent from '../email-data/addoredit-email-data.component';
import MdEditAccountComponent from '../modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListAccountComponent implements OnInit {
  public dialogHandlerService = inject(DialogHandlerService);
  public apiRequestService = inject(ApiRequestService);

  cb_customer: ISelectItemDto[] = [];
  cb_profession: ISelectItemDto[] = [];
  data: IAccountDto[] = [];
  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData(): void {
    this.apiRequestService.onGetList(`accounts/getall`).then((result: any) => {
      this.data = result;
    });
  }
  onCardEmployee(employeeId: number) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { employeeId },
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
        if (result) this.onLoadData();
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
        if (result) this.onLoadData();
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
          this.onLoadData();
        }
      });
  }

  onToBlockAccount(applicationUserId: string): void {
    this.apiRequestService
      .onGetList('Accounts/ToBlockAccount/' + applicationUserId)
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
      .onGetList('Accounts/ToUnlockAccount/' + applicationUserId)
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
      .onDelete('Accounts/' + applicationUserId)
      .then((result: boolean) => {
        if (result)
          this.data = this.data.filter((item) => item.id !== applicationUserId);
      });
  }
}
