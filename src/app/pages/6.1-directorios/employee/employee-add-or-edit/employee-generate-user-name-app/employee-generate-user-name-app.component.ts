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
      roleId: '6b8aa482-2d46-452c-9ad0-b9c2b561ebdd',
      roleName: 'Administrador',
      isSelected: false,
    },
    {
      roleId: '3cd4991d-f21d-4340-868a-bc3a0362f5c3',
      roleName: 'Asistente',
      isSelected: false,
    },
    {
      roleId: '1f526847-38d6-422b-a152-f601d465b583',
      roleName: 'Auxiliar de Mantenimiento',
      isSelected: false,
    },
    {
      roleId: '369b69f4-219c-4476-902f-68bb6472824c',
      roleName: 'Cobranza',
      isSelected: false,
    },
    {
      roleId: '844ee9d7-5837-42db-8561-f8e5e12eaa52',
      roleName: 'Condomino',
      isSelected: false,
    },
    {
      roleId: 'd5a031e4-a8ff-48ba-b20f-9d50251d4355',
      roleName: 'Contador',
      isSelected: false,
    },
    {
      roleId: '39cb8153-56d2-4ea9-9162-c80d5d0ee1af',
      roleName: 'Jardineria',
      isSelected: false,
    },
    {
      roleId: 'b7620a4a-1759-4260-b148-5be445410624',
      roleName: 'Jefe de limpieza',
      isSelected: false,
    },
    {
      roleId: '8d705bbd-6502-414d-b9ed-89acf994ef54',
      roleName: 'Jefe de Mantenimiento',
      isSelected: false,
    },
    {
      roleId: '3364c03a-86a5-4cf3-abc4-b770871ef920',
      roleName: 'Jefe de Seguridad',
      isSelected: false,
    },
    {
      roleId: 'b2545f85-5c53-4dac-b5a5-ccd8be679a28',
      roleName: 'Legal',
      isSelected: false,
    },
    {
      roleId: '6eb2f1d0-3a83-4fbb-8864-69d508fa6a9f',
      roleName: 'Limpieza',
      isSelected: false,
    },
    {
      roleId: '493a5544-17b3-450c-acc4-9d9155eb1278',
      roleName: 'Reclutamiento',
      isSelected: false,
    },
    {
      roleId: '00e6b795-d530-4113-83b6-3845c22f3f2e',
      roleName: 'Seguridad',
      isSelected: false,
    },
    {
      roleId: 'c0c7efa5-73a9-434c-a46b-ce925ad1520e',
      roleName: 'Sistemas',
      isSelected: false,
    },
    {
      roleId: '699d7cc1-d143-4985-b55a-d030864c693e',
      roleName: 'SuperUsuario',
      isSelected: false,
    },

    {
      roleId: 'c6a6dfaa-39a2-469a-8199-704de476b67d',
      roleName: 'Supervisor Operativo',
      isSelected: false,
    },
  ];

  rolesAdmin: IRoles[] = [
    {
      roleId: '6b8aa482-2d46-452c-9ad0-b9c2b561ebdd',
      roleName: 'Administrador',
      isSelected: false,
    },
    {
      roleId: '3cd4991d-f21d-4340-868a-bc3a0362f5c3',
      roleName: 'Asistente',
      isSelected: false,
    },
    {
      roleId: '1f526847-38d6-422b-a152-f601d465b583',
      roleName: 'Auxiliar de Mantenimiento',
      isSelected: false,
    },
    // {
    //   roleId: '844ee9d7-5837-42db-8561-f8e5e12eaa52',
    //   roleName: 'Condomino',
    //   isSelected: false,
    // },

    {
      roleId: '39cb8153-56d2-4ea9-9162-c80d5d0ee1af',
      roleName: 'Jardineria',
      isSelected: false,
    },
    {
      roleId: 'b7620a4a-1759-4260-b148-5be445410624',
      roleName: 'Jefe de limpieza',
      isSelected: false,
    },
    {
      roleId: '8d705bbd-6502-414d-b9ed-89acf994ef54',
      roleName: 'Jefe de Mantenimiento',
      isSelected: false,
    },
    {
      roleId: '3364c03a-86a5-4cf3-abc4-b770871ef920',
      roleName: 'Jefe de Seguridad',
      isSelected: false,
    },

    {
      roleId: '6eb2f1d0-3a83-4fbb-8864-69d508fa6a9f',
      roleName: 'Limpieza',
      isSelected: false,
    },

    {
      roleId: '00e6b795-d530-4113-83b6-3845c22f3f2e',
      roleName: 'Seguridad',
      isSelected: false,
    },
    {
      roleId: 'c0c7efa5-73a9-434c-a46b-ce925ad1520e',
      roleName: 'Sistemas',
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
