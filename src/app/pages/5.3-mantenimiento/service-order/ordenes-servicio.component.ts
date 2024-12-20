import { Component, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { ReporteOrdenesServicioService } from 'src/app/core/services/reporte-ordenes-servicio.service';
import SubirPdfComponent from 'src/app/shared/subir-pdf/subir-pdf.component';
import { environment } from 'src/environments/environment';
import ServiceOrderAddOrEditComponent from './addoredit-service-order.component';
import FormUploadImgComponent from './cargar-imagen/form-upload-img.component';
import OrdenesServicioFotosComponent from './ordenes-servicio-fotos/ordenes-servicio-fotos.component';
import OrdenesServicioReporteProveedorComponent from './ordenes-servicio-reporte-proveedor/ordenes-servicio-reporte-proveedor.component';
const date = new Date();

@Component({
  selector: 'app-OrdenesServicioComponent',
  templateUrl: './ordenes-servicio.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrdenesServicioComponentComponent
  implements OnInit, OnDestroy, OnChanges
{
  authS = inject(AuthService);
  customerIdService = inject(CustomerIdService);
  messageService = inject(MessageService);
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  dialogService = inject(DialogService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  customToastService = inject(CustomToastService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  mm = date.getMonth() + 1;
  fecha = [date.getFullYear(), (this.mm > 9 ? '' : '0') + this.mm].join('-');

  data: any[] = [];
  observations: [''];
  ref: DynamicDialogRef;

  urlImg: string = '';
  nameCarpetaFecha = '';
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  filtroEquiposValue: any = 'todos';
  filtroId: number | string = '';
  filtroEquipos = [
    { icon: 'fa-list-alt', id: '', nombre: 'todos' },
    { icon: 'fa-swimmer', id: 2, nombre: 'amenidades' },
    { icon: 'fa-hotel', id: 8, nombre: 'A. Comunes' },
    { icon: 'fa-door-open', id: 7, nombre: 'bodegas' },
    { icon: 'fa-cogs', id: 1, nombre: 'equipos' },
    { icon: 'fa-dumbbell', id: 5, nombre: 'gimnasio' },
    { icon: 'fa-video', id: 6, nombre: 'sistemas' },
    { icon: 'fa-paint-roller', id: 10, nombre: 'pintura' },
  ];
  onReloadOrdenes(id: any, filtroEquiposValue: any) {
    this.filtroEquiposValue = filtroEquiposValue;
    this.filtroId = id;

    if (this.filtroId === 10) {
      this.onLoadPintura();
    } else {
      this.onLoadData();
    }
  }

  public subscriber: Subscription;
  ngOnInit(): void {
    this.reporteOrdenesServicioService.setDate(Date.now);
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onReloadOrdenes(this.filtroId, this.filtroEquiposValue);
    });
  }

  onModalFormUploadImg(id: number) {
    this.ref = this.dialogService.open(FormUploadImgComponent, {
      data: {
        serviceOrderId: id,
      },
      header: 'Cargar Imagenes',
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
  onModalFormUploadDoc(id: number) {
    this.ref = this.dialogService.open(SubirPdfComponent, {
      data: {
        serviceOrderId: id,
        pathUrl: 'ServiceOrders/SubirDocumento/',
      },
      header: 'Cargar Documentos',
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
  onModalFotos(id: number) {
    this.ref = this.dialogService.open(OrdenesServicioFotosComponent, {
      data: {
        id,
      },
      header: 'Soporte Fotografico',
      width: '100%',
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
  onModalRpeorteProveedor(id: number) {
    this.ref = this.dialogService.open(
      OrdenesServicioReporteProveedorComponent,
      {
        data: {
          id,
        },
        header: 'Reportes de proveedor',
        styleClass: 'modal-md',
        closeOnEscape: true,
        baseZIndex: 10000,
      }
    );
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onLoadPintura() {
    let converToDate = new Date(this.fecha + '-' + 1);
    this.reporteOrdenesServicioService.setDate(converToDate);
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        `ServiceOrders/GetAllPintura/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(converToDate)}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteOrdenesServicioService.setData(this.data);

          if (this.data.length !== 0) {
            this.nameCarpetaFecha = this.dateService.getDateFormat(
              this.data[0].requestDate
            );
            this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadData() {
    let converToDate = new Date(this.fecha + '-' + 1);
    this.reporteOrdenesServicioService.setDate(converToDate);
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.dataService
      .get(
        `ServiceOrders/GetAll/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(converToDate)}/${this.filtroId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          this.reporteOrdenesServicioService.setData(this.data);

          if (this.data.length !== 0) {
            this.nameCarpetaFecha = this.dateService.getDateFormat(
              this.data[0].requestDate
            );
            this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          }
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
    this.customToastService.onClose();
  }

  onEdit(data: any) {
    this.ref = this.dialogService.open(ServiceOrderAddOrEditComponent, {
      data: {
        id: data.id,
        machineryId: data.machineryId,
        providerId: data.providerId,
      },
      header: data.title,
      width: '100%',
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

  onDelete(id: number) {
    this.apiRequestService
      .onDelete(`ServiceOrders/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
  ngOnChanges() {
    this.subscriber?.unsubscribe();
  }
}
