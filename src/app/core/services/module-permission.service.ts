import { inject, Injectable } from '@angular/core';
import { CustomerIdService } from './customer-id.service';

@Injectable({
  providedIn: 'root',
})
export class ModulePermissionService {
  customerIdS = inject(CustomerIdService);

  modulePermission: any[] = [];

  constructor() {}

  setModulePermission(modulePermission: any[]): void {
    this.modulePermission = modulePermission;
  }
}
