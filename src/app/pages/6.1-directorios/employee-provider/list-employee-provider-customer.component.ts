import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/core/interfaces/employee.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import CardEmployeeComponent from '../employee/card-employee/card-employee.component';
import { EmployeeAddOrEditService } from '../employee/employee-add-or-edit/employee-add-or-edit.service';
import { EmployeeProviderAddOrEditComponent } from '../employee/employee-provider-add-or-edit/employee-provider-add-or-edit.component';
const base_urlImg = environment.base_urlImg + 'Administration/accounts/';

@Component({
  selector: 'app-list-employee-provider-customer',
  templateUrl: './list-employee-provider-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEmployeeProviderCustomerComponent implements OnInit {
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  custIdService = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);

  activo: boolean = true;
  data: IEmployee[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  url = base_urlImg;

  customerId$: Observable<number> = this.custIdService.getCustomerId$();

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
    const urlApi = `ApplicationUserEmployee/Externo/List/${this.custIdService.customerId}/${this.activo}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        EmployeeProviderAddOrEditComponent,
        { id: data.id, typePerson: 1, title: data.title },
        'Agregar externo',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`Employees/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      {
        applicationUserId,
      },
      'Colaborador',
      this.dialogHandlerService.dialogSizeSm
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
