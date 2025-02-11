import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ETypePerson } from 'src/app/core/enums/type-person.enum';
import { IApplicationUserDto } from 'src/app/core/interfaces/account-dto.interface';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import CardEmployeeComponent from 'src/app/pages/directorios/employee-internal/card-employee.component';
import ModuleAppPermissionComponent from '../permisos/module-app-permission/module-app-permission.component';
import AddOrEditApplicationUserComponent from './add-or-edit-application-user.component';
import MdEditAccountComponent from './md-edit-account.component';

@Component({
  selector: 'app-list-application-user',
  templateUrl: './list-application-user.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [EnumSelectService],
})
export default class ListApplicationUserComponent implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);
  enumSelectS = inject(EnumSelectService);

  data: IApplicationUserDto[] = [];
  filteredData: IApplicationUserDto[] = []; // Para almacenar la data filtrada
  searchText: string = ''; // Para almacenar el texto de búsqueda
  selectCustomer: ISelectItem[] = [];

  applicationUserId: string = '';
  employeeId: number = 0;
  ref: DynamicDialogRef;
  state: boolean = true;
  title: string = '';
  applicationUserState: boolean = true;
  cb_typePerson: ISelectItem[] = [];
  typePerson: number = 0;

  async ngOnInit() {
    this.cb_typePerson = await this.enumSelectS.typePerson(false);
    this.onLoadData(true, this.typePerson);
  }

  onSearch() {
    const searchTextLower = this.searchText.toLowerCase();

    this.filteredData = this.data.filter((item) =>
      ['fullName', 'userName', 'customer', 'email', 'phoneNumber'].some((key) =>
        item[key]?.toLowerCase().includes(searchTextLower)
      )
    );
  }

  onLoadData(applicationUserState: boolean, typePerson: ETypePerson): void {
    this.apiRequestS
      .onGetList(`ApplicationUser/List/${applicationUserState}/${typePerson}`)
      .then((result: any) => {
        this.data = result;
        this.filteredData = result;

        // Agrupar customers únicos para el select
        const uniqueCustomers = [
          ...new Set(result.map((item: any) => item.customer)),
        ];

        // Crear opciones para el select
        this.selectCustomer = [
          { label: 'Mostrar todos', value: 'all' }, // Opción para mostrar todos
          ...uniqueCustomers.map(
            (customer): ISelectItem => ({
              label: customer ? String(customer) : 'Sin Cliente',
              value: customer ? String(customer) : 'sin_cliente',
            })
          ),
        ];
      });
  }

  // Método para filtrar por cliente
  onSelectForCustomer(selectedValue: string) {
    if (selectedValue === 'all') {
      // Si selecciona "Mostrar todos", mostrar todos los datos
      this.filteredData = this.data;
    } else {
      // Filtrar datos por el valor seleccionado
      this.filteredData = this.data.filter(
        (item: any) => item.customer === selectedValue
      );
    }
  }

  onSelectTypePerson(typePerson: ETypePerson): any {
    this.typePerson = typePerson;
    this.onLoadData(this.applicationUserState, typePerson);
  }
  onSelectActive(applicationUserState: boolean): any {
    this.applicationUserState = applicationUserState;
    this.onLoadData(applicationUserState, this.typePerson);
  }

  // Tarjeta de Usuraio
  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
      'Colaborador',
      this.dialogHandlerS.dialogSizeMd
    );
  }
  onAddOrEdit(applicationUserId: string, title: string) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditApplicationUserComponent,
        { applicationUserId },
        title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: any) => {
        if (result) this.onLoadData(this.applicationUserState, this.typePerson);
      });
  }

  onModalEditAccount(applicationUserId: string, email: string) {
    this.dialogHandlerS.openDialog(
      MdEditAccountComponent,
      {
        applicationUserId,
        email,
      },
      'Editar Cuenta',
      this.dialogHandlerS.dialogSizeFull
    );
  }

  onToBlockAccount(applicationUserId: string): void {
    this.apiRequestS
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
    this.apiRequestS
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
    this.apiRequestS
      .onDelete(`ApplicationUser/${applicationUserId}`)
      .then((result: boolean) => {
        if (result) {
          this.data = this.data.filter((item) => item.id !== applicationUserId);
          this.filteredData = this.filteredData.filter(
            (item) => item.id !== applicationUserId
          );
        }
      });
  }

  onModalPermission(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      ModuleAppPermissionComponent,
      {
        applicationUserId,
      },
      'Actualizar permisos de Usuario',
      this.dialogHandlerS.dialogSizeFull
    );
  }
}
