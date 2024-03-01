import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';
import FormActasEntregaEquiposComponent from '../mantenimiento-inventarios/activos/form-actas-entrega-equipos/form-actas-entrega-equipos.component';
@Component({
  selector: 'app-actas-entrega-equipos',
  templateUrl: './actas-entrega-equipos.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ActasEntregaEquiposComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);

  date = new Date();
  empresaReceptora: string = '';
  entregadoPor: string = '';
  recibidoPor: string = '';
  base_urlImg: string = '';
  base_urlImgLogo: string = environment.base_urlImg;
  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    this.onModalAddOrEdit();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.base_urlImg = this.urlImg(this.customerIdService.getcustomerId());
    this.customerId$.subscribe((resp) => {
      this.onLoadData();
      this.base_urlImg = this.urlImg(this.customerIdService.getcustomerId());
    });
  }

  onLoadData() {
    this.base_urlImg = this.urlImg(this.customerIdService.getcustomerId());
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(`Machineries/ActasEntrega/${this.customerIdService.customerId}`)
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
  urlImg(customerId: any): string {
    return `${environment.base_urlImg}customers/${customerId}/machinery/`;
  }

  onModalAddOrEdit() {
    this.ref = this.dialogService.open(FormActasEntregaEquiposComponent, {
      data: {},
      header: 'Actas de entrega',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((resp: any) => {
      this.date = resp.date;
      this.empresaReceptora = resp.empresaReceptora;
      this.entregadoPor = resp.entregadoPor;
      this.recibidoPor = resp.recibidoPor;
      this.ngOnInit();
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
