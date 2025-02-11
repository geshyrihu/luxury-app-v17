import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-module-app-permission',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './module-app-permission.component.html',
})
export default class ModuleAppPermissionComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  data: any[] = [];
  applicationUserId: string = '';

  ngOnInit(): void {
    this.applicationUserId = this.config.data.applicationUserId;
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetItem(`Permission/PermissionUser/${this.applicationUserId}`)
      .then((result: any) => {
        this.data = result;
      });
  }
  onCheckboxChange(permission: PermissionDto, field: string, checked: boolean) {
    // Actualiza el campo correspondiente en el objeto de permiso
    permission[field] = checked;

    // Aquí envías la solicitud para actualizar los permisos
    this.apiRequestS.onPut(`Permission/${permission.id}`, permission, false);
  }
}
export interface PermissionDto {
  id: string;
  moduleAppId: string;
  applicationUserId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  moduleName: string;
  applicationUserName: string;
}
