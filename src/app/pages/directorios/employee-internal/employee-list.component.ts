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
import CardEmployeeComponent from './card-employee.component';
import { EmployeeAddOrEditService } from './employee-add-or-edit.service';
import { EmployeeProviderAddOrEditComponent } from './employee-provider-addoredit.component';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class EmployeeListComponent implements OnInit {
  authS = inject(AuthService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);
  employeeAddOrEditService = inject(EmployeeAddOrEditService);
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
    const urlApi = `EmployeeInternal/List/${this.customerIdS.customerId}/${this.activo}`;

    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }

  onValidateShowTIcket(professionId: number): boolean {
    let permission = true;
    if (professionId == 5) {
      permission = this.authS.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
      ]);
    }
    if (professionId == 6) {
      permission = this.authS.onValidateRoles([
        'SupervisionOperativa',
        'SuperUsuario',
        'Reclutamiento',
        'Administrador',
      ]);
    }
    return permission;
  }
  showModalAddEmployee() {
    this.dialogHandlerS
      .openDialog(
        EmployeeProviderAddOrEditComponent,
        { typePerson: 0 },
        'Registrar Empleado.',
        this.dialogHandlerS.dialogSizeLg
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onCardEmployee(applicationUserId: string) {
    this.dialogHandlerS.openDialog(
      CardEmployeeComponent,
      { applicationUserId },
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
