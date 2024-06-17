import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';

@Component({
  selector: 'app-list-recorrido',
  templateUrl: './list-recorrido.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListRecorridoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);

  // Declaración e inicialización de variables
  data: any[] = [];
  cb_departaments = [
    { value: 3, label: 'Mantenimiento' },
    { value: 4, label: 'Limpieza' },
    { value: 6, label: 'Jardineria' },
    { value: 7, label: 'Sistemas' },
    { value: 8, label: 'Seguridad' },
  ];

  departamentId = 3;
  departamentLabel = 'MANTENIMIENTO';
  customerName = '';
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  amenitiesByLocation: { location: string; amenities: any[] }[];

  ngOnInit(): void {
    this.onLoadData(this.departamentId, this.customerIdService.customerId);
    this.customerId$.subscribe(() => {
      this.onLoadData(this.departamentId, this.customerIdService.customerId);
    });
  }

  onSelectDepartament(departamentId: number) {
    this.departamentId = departamentId;
    this.onLoadData(departamentId, this.customerIdService.customerId);
  }

  onLoadData(departamentId: number, customerId: number) {
    const urlApi = `customeramenitiescatalog/inspection/${customerId}/${departamentId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.onLoadDataCustomer(customerId);
    });
  }

  onLoadDataCustomer(customerId: number) {
    const urlApi = `customers/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.customerName = result.nameCustomer;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`customeramenitiescatalog/inspection/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
