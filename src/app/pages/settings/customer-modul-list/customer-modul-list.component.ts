import { Component, inject, OnInit } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

@Component({
  selector: 'app-customer-modul-list',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './customer-modul-list.component.html',
})
export default class CustomerModulListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);

  // Declaración e inicialización de variables
  data: any[] = [];
  state: boolean = true;
  selectCustomer: ISelectItem[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean): void {
    const urlApi = `ModuleAppCustomer/Customers/${state}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestS.onDelete(`ModuleAppCustomer/${id}`).then((_) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.data.filter((item) => item.id !== id);
    });
  }

  // Método para filtrar por cliente
  onSelectForCustomer(selectedValue: boolean) {
    this.onLoadData(selectedValue);
  }
}
