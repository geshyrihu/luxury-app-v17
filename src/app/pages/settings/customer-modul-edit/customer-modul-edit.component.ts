import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataConnectorService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-customer-modul-edit',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './customer-modul-edit.component.html',
})
export default class CustomerModulEditComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  activatedRoute = inject(ActivatedRoute);
  custIdService = inject(CustomerIdService);
  dataService = inject(DataConnectorService);
  // Declaración e inicialización de variables
  data: any[] = [];

  customerId: number | null = null;
  customerName: string; // Nombre del cliente para mostrar

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.params['customerId']; // Obtener el ID del cliente desde la URL
    this.customerName = this.activatedRoute.snapshot.params['customerName']; // Obtener el nombre del cliente desde la URL si lo tienes

    this.onLoadData(this.customerId); // Cargamos los datos cuando se obtiene el ID
  }

  onLoadData(customerId: number): void {
    const urlApi = `ModuleAppCustomer/Customer/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  toggleModuleActivation(item: any): void {
    item.isAssigned = !item.isAssigned;
    this.updateModuleStatus(item);
  }

  updateModuleStatus(item: any): void {
    const urlApi = 'ModuleAppCustomer/UpdateModuleStatus';
    const data = {
      customerId: this.customerId,
      moduleAppId: item.moduleAppId,
      isAssigned: item.isAssigned,
    };

    const customerId = this.custIdService.customerId;

    this.dataService.post(urlApi, data).subscribe((_) => {
      // this.custIdService.onLoadDataCustomer(customerId);
    });

    // this.apiRequestService.onPost(urlApi, data).then((_) => {
    //   this.custIdService.onLoadDataCustomer(customerId);
    // });
  }
}
