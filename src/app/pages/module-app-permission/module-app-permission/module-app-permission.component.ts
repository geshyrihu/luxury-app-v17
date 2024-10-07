import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-module-app-permission',
  standalone: true,
  imports: [],
  templateUrl: './module-app-permission.component.html',
})
export default class ModuleAppPermissionComponent {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  applicationUserId: string = '';
}
