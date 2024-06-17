import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import CustomInputModule from 'src/app/custom-components/custom-input-form/custom-input.module';
import EmployeeAddOrEditAdreessComponent from './employee-add-or-edit-adreess/employee-add-or-edit-adreess.component';
import EmployeeAddOrEditAvatarComponent from './employee-add-or-edit-avatar/employee-add-or-edit-avatar.component';
import EmployeeAddOrEditLaboralDataComponent from './employee-add-or-edit-laboral-data/employee-add-or-edit-laboral-data.component';
import EmployeeAddOrEditPersonalDataComponent from './employee-add-or-edit-personal-data/employee-add-or-edit-personal-data.component';
import EmployeeAddOrEditPrincipalDataComponent from './employee-add-or-edit-principal-data/employee-add-or-edit-principal-data.component';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';
import EmployeeEmergencyContactListComponent from './employee-emergency-contact/employee-emergency-contact-list.component';
import EmployeeGenerateUserNameAppComponent from './employee-generate-user-name-app/employee-generate-user-name-app.component';
import EmployeeReclutamientoComponent from './employee-reclutamiento/employee-reclutamiento.component';

@Component({
  selector: 'app-employee-add-or-edit',
  templateUrl: './employee-add-or-edit.component.html',
  standalone: true,
  imports: [
    LuxuryAppComponentsModule,
    CustomInputModule,
    EmployeeAddOrEditAdreessComponent,
    EmployeeAddOrEditAvatarComponent,
    EmployeeAddOrEditLaboralDataComponent,
    EmployeeAddOrEditPersonalDataComponent,
    EmployeeAddOrEditPrincipalDataComponent,
    EmployeeEmergencyContactListComponent,
    EmployeeGenerateUserNameAppComponent,
    EmployeeReclutamientoComponent,
  ],
})
export default class EmployeeAddOrEditComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestService = inject(ApiRequestService);
  authService = inject(AuthService);
  router = inject(Router);

  applicationUserId: string = '';
  employeeId: number = 0;
  nameEmployee: string = '';

  tienePermiso: boolean = true;

  ngOnInit() {
    // Validamos si el usuario authentiucado es admin o asistente
    if (
      this.authService.infoEmployeeDto.professionId == 5 ||
      this.authService.infoEmployeeDto.professionId == 57 ||
      this.authService.infoEmployeeDto.professionId == 58 ||
      this.authService.infoEmployeeDto.professionId == 6
    ) {
      this.onValidarAdminAsis();
    }

    this.applicationUserId = this.employeeAddOrEditService.onGetId();
    this.employeeId = this.employeeAddOrEditService.onGetEmployeeId();
    this.nameEmployee = this.employeeAddOrEditService.onGetNameEmployee();

    if (this.applicationUserId === '')
      this.router.navigate(['/directorio/empleados/interno']);
  }

  onValidarAdminAsis() {
    // ProfessionId Administrador= 5, Asistente = 6
    this.apiRequestService
      .onGetItem(
        `Employees/validaradminasis/${this.authService.applicationUserId}`
      )
      .then((result: any) => {
        this.tienePermiso = result;
      });
  }
}
