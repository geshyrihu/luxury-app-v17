import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { OrdenCompraService } from 'src/app/core/services/orden-compra.service';
import CaratulaFondeoComponent from '../../caratula-fondeo/caratula-fondeo.component';
import CreateOrdenCompraComponent from './create-orden-compra/create-orden-compra.component';
import OrdenCompraComponent from './orden-compra.component';

@Component({
  selector: 'app-list-orden-compra',
  templateUrl: './list-orden-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListOrdenCompraComponent implements OnInit, OnDestroy {
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public router = inject(Router);
  public ordenCompraService = inject(OrdenCompraService);
  public customerIdService = inject(CustomerIdService);

  data: any[] = [];
  ref: DynamicDialogRef;
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  statusCompra: number;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.statusCompra = this.ordenCompraService.getStatusCompras();
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.data = [];
    this.dataService
      .get(
        `OrdenCompra/GetAll/${this.customerIdService.customerId}/${this.statusCompra}`
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`ordencompra/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onOrdenCompraModal(id: number) {
    this.ordenCompraService.setOrdenCompraId(id);
    this.ref = this.dialogService.open(OrdenCompraComponent, {
      data: {
        id,
      },
      header: 'Editar Orden de Compra',
      width: '100%',
      height: '100%',
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
  onModalAdd() {
    this.ref = this.dialogService.open(CreateOrdenCompraComponent, {
      data: {},
      header: 'Nueva Orden de compra',
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

  onModalCaratula() {
    this.ref = this.dialogService.open(CaratulaFondeoComponent, {
      data: {},
      header: 'Caratula',
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
  onAddOrEdit(id: number) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${id}`);
  }

  onSelectStatus(status: number): void {
    this.ordenCompraService.setStatusCompras(status);
    this.onLoadData();
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
