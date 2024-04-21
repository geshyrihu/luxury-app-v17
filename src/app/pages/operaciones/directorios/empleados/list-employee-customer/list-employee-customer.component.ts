import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import ListEmpleadosOpcionesComponent from '../list-empleados-opciones/list-empleados-opciones.component';
import { WorkPositionOptionsComponent } from '../work-position-options/work-position-options.component';

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
  customerIdService = inject(CustomerIdService);
  rutaActiva = inject(ActivatedRoute);

  activo: boolean = true;
  data: IEmployee[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;

  tipoContrato: any;
  url = base_urlImg;

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.tipoContrato = this.rutaActiva.snapshot.params.parametro;
    this.onLoadData();
    this.rutaActiva.url.subscribe((url) => {
      this.tipoContrato = url[1].path;
      this.onLoadData();
    });
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onSelectActive(active: boolean): any {
    this.activo = active;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `employees/list/${this.customerIdService.customerId}/${this.activo}/${this.tipoContrato}`;

    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalEmpleadoOpciones(
    applicationUserId: string,
    personId: number,
    employeeId: number,
    active: boolean
  ) {
    this.dialogHandlerService
      .openDialog(
        ListEmpleadosOpcionesComponent,
        {
          applicationUserId,
          personId,
          employeeId,
          active,
        },
        'Opciones',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalWorkPositionOptions(workPositionId: number) {
    this.dialogHandlerService
      .openDialog(
        WorkPositionOptionsComponent,
        {
          workPositionId,
        },
        'Opciones Puesto de trabajo',
        this.dialogHandlerService.dialogSizeLg
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
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

  onCardEmployee(employeeId: number) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      {
        employeeId,
      },
      'Colaborador',
      this.dialogHandlerService.dialogSizeSm
    );
  }
}
