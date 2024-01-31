import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ICustomerDto } from 'src/app/core/interfaces/ICustomerDto.interface';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';

import { environment } from 'src/environments/environment';
import AddOrEditClienteComponent from './addoredit-clientes.component';
import CustomerAddressComponent from './customer-address/customer-address.component';
import CustomerImagesComponent from './customer-images/customer-images.component';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListCustomerComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public apiRequestService = inject(ApiRequestService);

  urlBaseImg = `${environment.base_urlImg}Administration/customer/`;
  data: ICustomerDto[] = [];
  ref: DynamicDialogRef;
  title = 'Activos';
  state = true;
  mostrar = true;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(`Customers/GetAllAsync/${this.state}`)
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`customers/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditClienteComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onUpdateImages(customerId: number) {
    this.ref = this.dialogService.open(CustomerImagesComponent, {
      data: {
        customerId,
      },
      header: 'Actualizar Imagenes',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onUpdateAddress(customerId: number) {
    this.ref = this.dialogService.open(CustomerAddressComponent, {
      data: {
        customerId,
      },
      header: 'Actualizar Direccion',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onSortChange(valor: any) {
    this.state = valor;
    this.state === true ? (this.title = 'Activos') : (this.title = 'Inctivos');
    this.onLoadData();
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
