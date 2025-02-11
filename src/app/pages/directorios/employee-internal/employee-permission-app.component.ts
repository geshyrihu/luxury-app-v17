import { Component, inject, Input, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { PermissionDto } from 'src/app/pages/settings/permisos/module-app-permission/module-app-permission.component';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';

@Component({
  selector: 'employee-permission-app',
  templateUrl: './employee-permission-app.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EmployeePermissionAppComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  authS = inject(AuthService);
  customToastService = inject(CustomToastService);

  @Input()
  applicationUserId: number = 0;

  data: any[] = [];
  ngOnInit() {
    this.onLoadData();
  }
  onLoadData() {
    this.apiRequestS
      .onGetItem(`Permission/PermissionUserAdmin/${this.applicationUserId}/`)
      .then((responseData: any) => {
        this.data = responseData;
      });
  }
  onCheckboxChange(permission: PermissionDto, field: string, checked: boolean) {
    // Actualiza el campo correspondiente en el objeto de permiso
    permission[field] = checked;

    // Aquí envías la solicitud para actualizar los permisos
    this.apiRequestS.onPut(`Permission/${permission.id}`, permission, false);
  }
}
