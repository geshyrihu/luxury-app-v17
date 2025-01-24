import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-module-app-rol-update',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './module-app-rol-update.component.html',
})
export default class ModuleAppRolUpdateComponent {
  apiRequestService = inject(ApiRequestService);
  activatedRoute = inject(ActivatedRoute);
  custIdService = inject(CustomerIdService);

  // Declaración e inicialización de variables
  data: any[] = [];

  roleId: string;
  roleName: string; // Nombre del cliente para mostrar

  ngOnInit(): void {
    this.roleId = this.activatedRoute.snapshot.params['roleId']; // Obtener el ID del cliente desde la URL
    this.roleName = this.activatedRoute.snapshot.params['roleName']; // Obtener el nombre del cliente desde la URL si lo tienes

    this.onLoadData(this.roleId); // Cargamos los datos cuando se obtiene el ID
  }

  onLoadData(roleId: string): void {
    const urlApi = `ModuleAppRol/Assignments/${roleId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  toggleModuleActivation(item: any): void {
    item.isAssigned = !item.isAssigned;
    this.updateModuleStatus(item);
  }

  updateModuleStatus(item: any): void {
    const urlApi = 'ModuleAppRol/UpdateModuleAppRolAssigned';
    const data = {
      roleId: this.roleId,
      moduleAppId: item.moduleAppId,
      isAssigned: item.isAssigned,
    };

    this.apiRequestService.onPost(urlApi, data).then((result: any) => {
      this.custIdService.onLoadDataCustomer(this.custIdService.customerId);
    });
  }
}
