import { Component, OnInit, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditInspectionToRecorridoComponent from 'src/app/pages/0-settings/list-recorrido/add-or-edit-inspection-to-recorrido/add-or-edit-inspection-to-recorrido.component';
import AddOrEditCustomerAmenitiesCatalogComponent from '../add-or-edit-customer-amenities-catalog/add-or-edit-customer-amenities-catalog.component';

@Component({
  selector: 'app-list-customer-amenities-catalog',
  templateUrl: './list-customer-amenities-catalog.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, NgbAlert],
})
export default class ListCustomerAmenitiesCatalogComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  dialogHandlerService = inject(DialogHandlerService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any[] = [];
  dataCustomer: any[] = [];

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onDoubleClick(item: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditCustomerAmenitiesCatalogComponent,
        {
          amenitiescatalogid: item.id,
          customerId: this.customerIdService.customerId,
        },
        'Agregar Amenidad',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: any) => {
        if (result) {
          this.dataCustomer.push(result);
          // this.data = this.data.filter((x) => x.id !== item.id);
        }
      });
  }

  onRemoveItem(id: any) {
    const urlApi = `customeramenitiescatalog/remove/${id}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      if (result) {
        // Filtrar los elementos que tienen un id diferente al id que se va a eliminar
        this.dataCustomer = this.dataCustomer.filter((item) => item.id !== id);
        this.data.push(result);
        this.data.sort((a, b) => {
          // Ordenar por la propiedad "name"
          return a.name.localeCompare(b.name);
        });
        this.dataCustomer.sort((a, b) => {
          // Ordenar por la propiedad "name"
          return a.name.localeCompare(b.name);
        });
      }
    });
  }

  onLoadData() {
    const urlApi = `customeramenitiescatalog/${this.customerIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result.amenities;
      this.dataCustomer = result.listCustomerAmenities;
    });
  }

  onRowReorder(event: any) {
    let newdate: any[] = [];

    for (let i = 0; i < this.dataCustomer.length; i++) {
      const elemento: any = {
        positionIndex: i,
        customerAmenitiesCatalogId: this.dataCustomer[i].id,
      };
      newdate.push(elemento);
    }

    const urlApi = `customeramenitiescatalog/updatepositionindex/${this.customerIdService.customerId}`;
    this.apiRequestService.onPut(urlApi, newdate).then((result: any) => {
      this.dataCustomer = result;
    });
  }
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditInspectionToRecorridoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
