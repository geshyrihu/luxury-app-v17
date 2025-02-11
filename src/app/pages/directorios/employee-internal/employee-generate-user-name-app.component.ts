import { Component, Input, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { IResetPassword } from 'src/app/core/interfaces/reset-password.interface';
import { IRoles } from 'src/app/core/interfaces/roles.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import { RolesAdmin, RolesSuperUser } from '../employee-external/roles';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';

@Component({
  selector: 'employee-generate-user-name-app',
  templateUrl: './employee-generate-user-name-app.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, CustomInputModule],
})
export default class EmployeeGenerateUserNameAppComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
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
  roles: IRoles[] = [];
  rolesSuperUser: IRoles[] = RolesSuperUser;
  rolesAdmin: IRoles[] = RolesAdmin;

  getRoles() {
    this.apiRequestS
      .onGetList('ApplicationUser/GetRole/' + this.applicationUserId)
      .then((result: IRoles[]) => {
        if (this.authS.onValidateRoles(['SuperUsuario'])) {
          // Filtra los roles que se encuentran en rolesSuperUser
          this.roles = this.filterRoles(this.rolesSuperUser, result);
        } else {
          // Filtra los roles que se encuentran en rolesAdmin
          this.roles = this.filterRoles(this.rolesAdmin, result);
        }
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

  ngOnInit(): void {
    this.onLoadData();
    this.getRoles();
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(
        `EmployeeInternal/DataForRecoveryPassword/${this.applicationUserId}`
      )
      .then((result: any) => {
        if (result) {
          const { email, phoneNumber, userName } = result;
          this.email = email;
          this.phoneNumber = phoneNumber;
          this.userName = userName;
        }
      });

    this.apiRequestS
      .onGetItem(`EmployeeInternal/OnValidateState/${this.applicationUserId}`)
      .then((result: any) => {
        this.applicationUserState = result;
      });
  }

  sendOnlyPasswordEmail() {
    this.submitting = true;
    this.apiRequestS
      .onGetItem(`Auth/SendNewPasswordForEmail/${this.applicationUserId}`)
      .then(() => {
        this.submitting = false;
        this.customToastService.onShowSuccess();
      });
  }
  onGenerateUserNameAndPassword() {
    this.submitting = true;
    this.apiRequestS
      .onGetItem(`Auth/SendNewUserNameForEmail/${this.applicationUserId}`)
      .then(() => {
        this.onLoadData();
        this.submitting = false;
        this.customToastService.onShowSuccess();
      });
  }

  selectRole(selectedRole: IRoles): void {
    // Deseleccionar todos los roles
    this.roles.forEach((role) => (role.isSelected = false));

    // Seleccionar el rol actual
    selectedRole.isSelected = true;

    // Enviar al backend
    this.apiRequestS.onPost(
      `ApplicationUser/AddRoleToUser/${this.applicationUserId}`,
      selectedRole
    );
  }
  onToBlockAccount() {
    this.apiRequestS
      .onGetList(`ApplicationUser/ToBlockAccount/${this.applicationUserId}`)
      .then(() => {
        this.onLoadData();
      });
  }
  onToUnlockAccount() {
    this.apiRequestS
      .onGetList(`ApplicationUser/ToUnlockAccount/${this.applicationUserId}`)
      .then(() => {
        this.onLoadData();
      });
  }
}
