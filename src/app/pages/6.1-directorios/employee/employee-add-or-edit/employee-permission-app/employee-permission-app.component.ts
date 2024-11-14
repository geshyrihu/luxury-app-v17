import { Component, inject, Input, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { PermissionDto } from 'src/app/pages/1.1-catalogos/1.1.1-module-app/module-app-permission/module-app-permission.component';
import { EmployeeAddOrEditService } from '../employee-add-or-edit.service';

@Component({
  selector: 'employee-permission-app',
  templateUrl: './employee-permission-app.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class EmployeePermissionAppComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
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
    this.apiRequestService
      .onGetItem(`Permission/PermissionUserAdmin/${this.applicationUserId}/`)
      .then((result: any) => {
        this.data = result;
      });
  }
  onCheckboxChange(permission: PermissionDto, field: string, checked: boolean) {
    // Actualiza el campo correspondiente en el objeto de permiso
    permission[field] = checked;

    // Aquí envías la solicitud para actualizar los permisos
    this.apiRequestService.onPut(
      `Permission/${permission.id}`,
      permission,
      false
    );
  }
}
