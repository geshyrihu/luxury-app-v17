import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
    selector: 'app-module-app-rol-update',
    imports: [LuxuryAppComponentsModule],
    templateUrl: './module-app-rol-update.component.html'
})
export default class ModuleAppRolUpdateComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  activatedRoute = inject(ActivatedRoute);
  customerIdS = inject(CustomerIdService);

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
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
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

    this.apiRequestS.onPost(urlApi, data).then((responseData: any) => {
      this.customerIdS.onLoadDataCustomer(this.customerIdS.customerId);
    });
  }
  checkIfTwoDigitsAndSpace(moduleAppName: string): boolean {
    if (!moduleAppName) return false;

    // Expresión regular para verificar si después de dos dígitos hay un espacio
    const regex = /^\d{2} /;
    const result = regex.test(moduleAppName);
    return result;
  }
}
