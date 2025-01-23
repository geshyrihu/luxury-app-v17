import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-ordenes-servicio-reporte-proveedor',
  templateUrl: './ordenes-servicio-reporte-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenesServicioReporteProveedorComponent
  implements OnInit
{
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  messageService = inject(MessageService);
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);

  id: number = 0;
  data: any[] = [];

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== 0) this.onLoadData();
  }
  onLoadData() {
    const customerId = this.custIdService.getCustomerId();
    const urlApi = `ServiceOrders/OrdenesServicioReporteProveedor/${this.id}/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }

  deleteDoc(id: number): void {
    const urlApi = `ServiceOrders/DeleteDocument/${id}`;

    this.apiRequestService.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData();
    });
  }
}
