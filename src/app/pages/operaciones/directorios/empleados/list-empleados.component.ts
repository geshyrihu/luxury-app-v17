import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IEmployeeDto } from 'src/app/core/interfaces/IEmployeeDto.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import AddAccountCustomerComponent from './add-account-customer.component';
import ListEmpleadosOpcionesComponent from './list-empleados-opciones/list-empleados-opciones.component';

const base_urlImg = environment.base_urlImg + 'Administration/accounts/';
@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class ListEmployeeComponent implements OnInit, OnDestroy {
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  private dialogService = inject(DialogService);
  private rutaActiva = inject(ActivatedRoute);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);

  activo: boolean = true;
  data: IEmployeeDto[] = [];
  getAllEmployeeActive: any = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
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
    this.subRef$ = this.dataService
      .get<IEmployeeDto[]>(
        `employees/list/${this.customerIdService.customerId}/${this.activo}/${this.tipoContrato}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onModalEmpleadoOpciones(
    applicationUserId: string,
    employeeId: number,
    active: boolean
  ) {
    this.ref = this.dialogService.open(ListEmpleadosOpcionesComponent, {
      data: {
        applicationUserId,
        employeeId,
        active,
      },
      baseZIndex: 10000,
      closeOnEscape: true,
      styleClass: 'modal-md',
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
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
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
