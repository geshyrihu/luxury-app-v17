import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { IAddCustomerPermisoToUserDto } from 'src/app/core/interfaces/IAddCustomerPermisoToUserDto.interface';
import {
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
@Component({
  selector: 'app-access-customer',
  templateUrl: './access-customer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastModule,
  ],
  providers: [MessageService, CustomToastService],
})
export default class AccessCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);

  clientes: IAddCustomerPermisoToUserDto[] = [];
  ActualizarClientes: IAddCustomerPermisoToUserDto[] = [];
  checked = false;
  @Input()
  applicationUserId: string = '';
  subRef$: Subscription;
  ngOnInit(): void {
    this.onGetAccesCustomer();
  }
  onGetAccesCustomer() {
    this.subRef$ = this.dataService
      .get('AccesoClientes/GetCustomers/' + this.applicationUserId)
      .subscribe({
        next: (resp: any) => {
          this.clientes = resp.body;
          this.ActualizarClientes = this.clientes;
        },
      });
  }

  onUpdateAcceso(roles: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    const url = `AccesoClientes/AddCustomerAccesoToUser/${this.applicationUserId}`;
    this.subRef$ = this.dataService.post(url, roles).subscribe({
      next: () => {
        this.customToastService.onCloseToSuccess();
      },
      error: (err) => {
        // En caso de error, mostrar un mensaje de error y registrar el error en la consola
        this.customToastService.onCloseToError();
        console.log(err.error);
      },
    });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
