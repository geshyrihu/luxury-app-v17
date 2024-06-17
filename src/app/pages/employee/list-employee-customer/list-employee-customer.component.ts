import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/core/interfaces/employee.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddAccountCustomerComponent from '../add-account-to-customer/add-account-customer.component';
import CardEmployeeComponent from '../card-employee/card-employee.component';
import { EmployeeAddOrEditService } from '../employee-add-or-edit/employee-add-or-edit.service';

const base_urlImg = environment.base_urlImg + 'Administration/accounts/';
@Component({
  selector: 'app-list-employee-customer',
  templateUrl: './list-employee-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEmployeeComponent implements OnInit {
  authService = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
  customerIdService = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);
  router = inject(Router);

  activo: boolean = true;
  data: IEmployee[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  url = base_urlImg;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

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
    const urlApi = `ApplicationUserEmployee/List/${this.customerIdService.customerId}/${this.activo}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onValidateShowTIcket(professionId: number): boolean {
    let permission = true;
    if (professionId == 5) {
      permission = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
      ]);
    }
    if (professionId == 6) {
      permission = this.authService.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
        'Residente',
      ]);
    }
    return permission;
  }
  showModalAddEmployee() {
    this.dialogHandlerService
      .openDialog(
        AddAccountCustomerComponent,
        {},
        'Agregar cuenta de usuario',
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: number) {
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
    this.router.navigateByUrl('directorio/empleado');
  }
}
