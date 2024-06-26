import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { CustomerDataCompanyDto } from './CustomerDataCompanyDto';
import AddOrEditCustomerDataCompanyComponent from './add-or-edit-customer-data-company.component';

@Component({
  selector: 'customer-data-company',
  templateUrl: './list-customer-data-company.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListCustomerDataCompanyComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  data: CustomerDataCompanyDto[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `CustomerDataCompany`;
    this.apiRequestService
      .onGetList(urlApi)
      .then((result: CustomerDataCompanyDto[]) => {
        this.data = result;
      });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: string) {
    this.apiRequestService
      .onDelete(`CustomerDataCompany/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditCustomerDataCompanyComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
