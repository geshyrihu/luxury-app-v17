import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IEmployee } from 'src/app/core/interfaces/employee.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { environment } from 'src/environments/environment';
import AddAccountCustomerComponent from '../add-account-to-customer/add-account-customer.component';
import CardEmployeeComponent from '../card-employee/card-employee.component';
import ListEmpleadosOpcionesComponent from '../list-empleados-opciones/list-empleados-opciones.component';

const base_urlImg = environment.base_urlImg + 'Administration/accounts/';
@Component({
  selector: 'app-list-employee-customer',
  templateUrl: './list-employee-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListEmployeeComponent implements OnInit, OnDestroy {
  private customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  private dialogService = inject(DialogService);
  private rutaActiva = inject(ActivatedRoute);
  authService = inject(AuthService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    this.customerId$ = this.customerIdService.getCustomerId$();
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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<IEmployee[]>(
        `employees/list/${this.customerIdService.customerId}/${this.activo}/${this.tipoContrato}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onModalEmpleadoOpciones(
    applicationUserId: string,
    personId: number,
    employeeId: number,
    active: boolean
  ) {
    this.ref = this.dialogService.open(ListEmpleadosOpcionesComponent, {
      data: {
        applicationUserId,
        personId,
        employeeId,
        active,
      },
      header: 'Opciones',
      baseZIndex: 10000,
      closeOnEscape: true,
      styleClass: 'modal-lg',
    });
    this.ref.onClose.subscribe(() => {
      this.onLoadData();
    });
  }
  showModalAddAccount() {
    this.ref = this.dialogService.open(AddAccountCustomerComponent, {
      data: {},
      header: 'Agregar cuenta de usuario',
      styleClass: 'modal-lg',
      baseZIndex: 10000,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Colaborador',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
