import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/core/interfaces/employee.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CardEmployeeComponent from '../employee-internal/card-employee.component';
import { EmployeeAddOrEditService } from '../employee-internal/employee-add-or-edit.service';
import { EmployeeProviderAddOrEditComponent } from '../employee-internal/employee-provider-addoredit.component';

@Component({
    selector: 'app-employee-external-list',
    templateUrl: './employee-external-list.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class EmployeeExternalListComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);

  activo: boolean = true;
  data: IEmployee[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onSelectActive(active: boolean): any {
    this.activo = active;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `EmployeeExternal/List/${this.customerIdS.customerId}/${this.activo}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        EmployeeProviderAddOrEditComponent,
        { id: data.id, typePerson: 1, title: data.title },
        'Agregar externo',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  onDelete(id: number) {
    this.apiRequestS
      .onDelete(`Employees/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployeeComponent,
      {
        applicationUserId,
      },
      'Colaborador',
      this.dialogHandlerS.dialogSizeSm
    );
  }
  onShowModalEditEmpleado(
    applicationUserId: string,
    employeeId: number,
    nameEmployee: string
  ) {
    this.employeeAddOrEditService.onSetId(applicationUserId);
    this.employeeAddOrEditService.onSetEmployeeId(employeeId);
    this.employeeAddOrEditService.onSetNameEmployee(nameEmployee);
    this.router.navigateByUrl('directory/empleado');
  }
}
