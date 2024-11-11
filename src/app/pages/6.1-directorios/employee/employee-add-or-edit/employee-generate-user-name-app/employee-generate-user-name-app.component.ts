import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IResetPassword } from 'src/app/core/interfaces/reset-password.interface';
import { IRoles } from 'src/app/core/interfaces/roles.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';

@Component({
  selector: 'employee-generate-user-name-app',
  templateUrl: './employee-generate-user-name-app.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeGenerateUserNameAppComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  authS = inject(AuthService);
  customToastService = inject(CustomToastService);

  @Input()
  applicationUserId: number = 0;

  submitting: boolean = false;
  userInfoDto: IResetPassword;

  email: string = '';
  phoneNumber: string = '';
  userName: string = '';
  checked = false;
  applicationUserState: boolean = false;
  // rolesUpdate: IRoles[] = [];
  getRoles() {
    this.apiRequestService
      .onGetList('ApplicationUser/GetRole/' + this.applicationUserId)
      .then((result: IRoles[]) => {
        // Filtra los roles que se encuentran en rolesSuperUser
        this.rolesSuperUser = this.filterRoles(this.rolesSuperUser, result);

        // Filtra los roles que se encuentran en rolesAdmin
        this.rolesAdmin = this.filterRoles(this.rolesAdmin, result);
      });
  }

  // Función para filtrar y actualizar la lista de roles
  filterRoles(predefinedRoles: IRoles[], fetchedRoles: IRoles[]): IRoles[] {
    return predefinedRoles.map((predefinedRole) => {
      const fetchedRole = fetchedRoles.find(
        (role) => role.roleId === predefinedRole.roleId
      );
      if (fetchedRole) {
        predefinedRole.isSelected = fetchedRole.isSelected;
      }
      return predefinedRole;
    });
  }
  roles: IRoles[] = [];

  rolesSuperUser: IRoles[] = [
    {
      roleId: '12a4611b-8213-4040-8ed5-16bc9f1934c7',
      roleName: 'Sistemas',
      isSelected: false,
    },
    {
      roleId: '21bbee13-be15-43f4-8482-40694e8a8124',
      roleName: 'Operaciones',
      isSelected: false,
    },
    {
      roleId: '257a8b97-5e50-4ac5-8083-53d755b9da9a',
      roleName: 'Colaborador',
      isSelected: false,
    },
    {
      roleId: '398d295f-062b-4c92-b449-267f63439559',
      roleName: 'Mantenimiento',
      isSelected: false,
    },
    {
      roleId: '3cd4991d-f21d-4340-868a-bc3a0362f5c3',
      roleName: 'Asistente',
      isSelected: false,
    },
    {
      roleId: '7addd2fb-c5dc-45e4-a16c-9a940898cbd9',
      roleName: 'Direccion',
      isSelected: false,
    },
    {
      roleId: '83615151-b431-4c34-bb1a-3f1d22109f21',
      roleName: 'Cliente',
      isSelected: false,
    },
    {
      roleId: '844ee9d7-5837-42db-8561-f8e5e12eaa52',
      roleName: 'Administrador',
      isSelected: false,
    },
    {
      roleId: '862f8332-9c5e-41c3-8ceb-218119150de2',
      roleName: 'Legal',
      isSelected: false,
    },
    {
      roleId: '90048e42-82b4-4f80-aeaf-ce32dbd63e9e',
      roleName: 'Proveedor',
      isSelected: false,
    },
    {
      roleId: '93cb6199-1f65-4609-b10c-5c938dc6f3f1',
      roleName: 'Reclutamiento',
      isSelected: false,
    },
    {
      roleId: '9b0b2d1c-ae39-47bc-ad10-252e2ce29cda',
      roleName: 'SupervisorContable',
      isSelected: false,
    },
    {
      roleId: 'ab5ea21b-0a6a-4fd4-8beb-b12f921c853b',
      roleName: 'GerenteMantenimiento',
      isSelected: false,
    },
    {
      roleId: 'c6a6dfaa-39a2-469a-8199-704de476b67d',
      roleName: 'SupervisionOperativa',
      isSelected: false,
    },
    {
      roleId: 'd5a031e4-a8ff-48ba-b20f-9d50251d4355',
      roleName: 'Contador',
      isSelected: false,
    },
  ];

  rolesAdmin: IRoles[] = [
    {
      roleId: '257a8b97-5e50-4ac5-8083-53d755b9da9a',
      roleName: 'Colaborador',
      isSelected: false,
    },
    {
      roleId: '398d295f-062b-4c92-b449-267f63439559',
      roleName: 'Mantenimiento',
      isSelected: false,
    },
    {
      roleId: '3cd4991d-f21d-4340-868a-bc3a0362f5c3',
      roleName: 'Asistente',
      isSelected: false,
    },
    {
      roleId: '844ee9d7-5837-42db-8561-f8e5e12eaa52',
      roleName: 'Administrador',
      isSelected: false,
    },
  ];
  ngOnInit(): void {
    this.onLoadData();
    this.getRoles();
  }
  onLoadData() {
    this.apiRequestService
      .onGetItem(
        `ApplicationUserEmployee/DataForRecoveryPassword/${this.applicationUserId}`
      )
      .then((result: any) => {
        if (result) {
          const { email, phoneNumber, userName } = result;
          this.email = email;
          this.phoneNumber = phoneNumber;
          this.userName = userName;
        }
      });

    this.apiRequestService
      .onGetItem(
        `ApplicationUserEmployee/OnValidateState/${this.applicationUserId}`
      )
      .then((result: any) => {
        this.applicationUserState = result;
      });
  }

  sendOnlyPasswordEmail() {
    this.submitting = true;
    this.apiRequestService
      .onGetItem(`Auth/SendNewPasswordForEmail/${this.applicationUserId}`)
      .then(() => {
        this.submitting = false;
        this.customToastService.onShowSuccess();
      });
  }
  onGenerateUserNameAndPassword() {
    this.submitting = true;
    this.apiRequestService
      .onGetItem(`Auth/SendNewUserNameForEmail/${this.applicationUserId}`)
      .then(() => {
        this.onLoadData();
        this.submitting = false;
        this.customToastService.onShowSuccess();
      });
  }
  updateRole(roles: any): void {
    this.apiRequestService.onPost(
      `ApplicationUser/AddRoleToUser/${this.applicationUserId}`,
      roles
    );
  }

  onToBlockAccount() {
    this.apiRequestService
      .onGetList(`ApplicationUser/ToBlockAccount/${this.applicationUserId}`)
      .then(() => {
        this.onLoadData();
      });
  }
  onToUnlockAccount() {
    this.apiRequestService
      .onGetList(`ApplicationUser/ToUnlockAccount/${this.applicationUserId}`)
      .then(() => {
        this.onLoadData();
      });
  }
}
