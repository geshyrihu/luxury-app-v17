import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';

import EditSalidasComponent from './edit-salidas/edit-salidas.component';

@Component({
  selector: 'app-list-salidas',
  templateUrl: './list-salidas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListSalidasComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  private customerIdService = inject(CustomerIdService);
  private dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);

  data: any[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get<any[]>(
        `SalidaProductos/GetSalidaProductos/${this.customerIdService.customerId}`
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
      .onDelete(`salidaproductos/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onEditSalida(data: any) {
    this.ref = this.dialogService.open(EditSalidasComponent, {
      data: {
        id: data.id,
        idProducto: data.idProducto,
        nombreProducto: data.nombreProducto,
        idInventarioProducto: data.idInventarioProducto,
      },
      header: 'Salida de Productos',
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
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
