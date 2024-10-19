import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ApiRequestService } from '../../../../core/services/api-request.service';
import CompanyDepartmentsAddOrEditComponent from '../company-departments-add-or-edit/company-departments-add-or-edit.component';
import { DepartmentGroup } from '../departament-group';

@Component({
  selector: 'app-company-departments-list',
  templateUrl: './company-departments-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class CompanyDepartmentListComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  data: DepartmentGroup = null;
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `CompanyDepartment/List`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`CompanyDepartment/${id}`)
      .then((result: boolean) => {
        this.onLoadData();
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        CompanyDepartmentsAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
