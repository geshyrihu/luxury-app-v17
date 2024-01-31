import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
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
    LuxuryAppComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastModule,
  ],
})
export default class AccessCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public customToastService = inject(CustomToastService);

  clientes: IAddCustomerPermisoToUserDto[] = [];
  ActualizarClientes: IAddCustomerPermisoToUserDto[] = [];
  checked = false;
  @Input()
  applicationUserId: string = '';

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onGetAccesCustomer();
  }
  onGetAccesCustomer() {
    this.dataService
      .get('AccessToClients/GetCustomers/' + this.applicationUserId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
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
    const url = `AccessToClients/AddCustomerAccesoToUser/${this.applicationUserId}`;
    this.dataService
      .post(url, roles)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: () => {
          this.customToastService.onCloseToSuccess();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
