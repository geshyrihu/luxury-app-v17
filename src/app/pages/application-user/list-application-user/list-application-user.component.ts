import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IApplicationUserDto } from 'src/app/core/interfaces/account-dto.interface';
import CardEmployeeComponent from 'src/app/pages/employee/card-employee/card-employee.component';

import { ETypePerson } from 'src/app/core/enums/type-person.enum';
import { onGetSelectItemFromEnum } from 'src/app/core/helpers/enumeration';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddOrEditApplicationUserComponent from '../add-or-edit-application-user/add-or-edit-application-user.component';
import MdEditAccountComponent from '../modal-edit-account/modal-edit-account/md-edit-account.component';
@Component({
  selector: 'app-list-application-user',
  templateUrl: './list-application-user.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListApplicationUserComponent implements OnInit {
  dialogHandlerService = inject(DialogHandlerService);
  apiRequestService = inject(ApiRequestService);

  data: IApplicationUserDto[] = [];

  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  urlImgApi = environment.base_urlImg + 'Administration/accounts/';
  applicationUserState: boolean = true;
  cb_typePerson: ISelectItem[] = onGetSelectItemFromEnum(ETypePerson);
  typePerson: ETypePerson = ETypePerson.Employee;
  ngOnInit(): void {
    this.onLoadData(true, this.typePerson);
  }
  onLoadData(applicationUserState: boolean, typePerson: ETypePerson): void {
    this.apiRequestService
      .onGetList(`ApplicationUser/List/${applicationUserState}/${typePerson}`)
      .then((result: any) => {
        this.data = result;
      });
  }
  onSelectTypePerson(typePerson: ETypePerson): any {
    this.typePerson = typePerson;
    this.onLoadData(this.applicationUserState, typePerson);
  }
  onSelectActive(applicationUserState: boolean): any {
    this.applicationUserState = applicationUserState;
    this.onLoadData(applicationUserState, this.typePerson);
  }
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerService.dialogSizeMd
    );
  }
  onAddOrEdit(applicationUserId: string) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditApplicationUserComponent,
        { applicationUserId },
        'Crear Cuenta',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: any) => {
        if (result) this.onLoadData(this.applicationUserState, this.typePerson);
      });
  }

  onModalEditAccount(applicationUserId: string, email: string) {
    this.dialogHandlerService.openDialog(
      MdEditAccountComponent,
      {
        applicationUserId,
        email,
      },
      'Editar Cuenta',
      this.dialogHandlerService.dialogSizeFull
    );
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
