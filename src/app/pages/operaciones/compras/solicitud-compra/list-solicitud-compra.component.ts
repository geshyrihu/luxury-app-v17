import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  SolicitudCompraService,
} from 'src/app/core/services/common-services';

@Component({
  selector: 'app-list-solicitud-compra',
  templateUrl: './list-solicitud-compra.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListSolicitudCompraComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public messageService = inject(MessageService);
  public router = inject(Router);
  public solicitudCompraService = inject(SolicitudCompraService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  data: any[] = [];
  ref: DynamicDialogRef;
  subRef$: Subscription;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  statusCompra: number = this.solicitudCompraService.onGetStatusFiltro();
  textoFiltro: string = this.solicitudCompraService.onGetTextoFiltro();

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onBusqueda(texto: string) {
    this.solicitudCompraService.onSetTextoFiltro(texto);
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get(
        `SolicitudCompra/Solicitudes/${
          this.customerIdService.customerId
        }/${this.solicitudCompraService.onGetStatusFiltro()}`
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
      .onDelete(`solicitudcompra/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  onSolicitudCompra(id: number) {
    this.router.navigateByUrl(`operaciones/compras/solicitud-compra/${id}`);
  }

  onSelectStatus(status: any) {
    this.solicitudCompraService.onSetStatusFiltro(status);

    this.onLoadData();
  }
  // ...Crear Orden de compra
  onCreateOrder(id: any) {
    this.router.navigateByUrl(`operaciones/compras/orden-compra/${0}/${id}`);
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
