import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  DateService,
  ReporteOrdenesServicioService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
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
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    NgbTooltipModule,
    PrimeNgModule,
  ],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class OrdenesServicioComponentComponent
  implements OnInit, OnDestroy, OnChanges
{
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  public dialogService = inject(DialogService);
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);

  mm = date.getMonth() + 1;
  fecha = [date.getFullYear(), (this.mm > 9 ? '' : '0') + this.mm].join('-');

  data: any[] = [];
  observations: [''];
  ref: DynamicDialogRef;
  subRef$: Subscription;

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

    this.subRef$ = this.dataService
      .get(
        `ServiceOrders/GetAllPintura/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(converToDate)}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.reporteOrdenesServicioService.setData(this.data);

          if (this.data.length !== 0) {
            this.nameCarpetaFecha = this.dateService.getDateFormat(
              this.data[0].requestDate
            );
            this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          }
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }
  onLoadData() {
    let converToDate = new Date(this.fecha + '-' + 1);
    this.reporteOrdenesServicioService.setDate(converToDate);
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    this.subRef$ = this.dataService
      .get(
        `ServiceOrders/GetAll/${
          this.customerIdService.customerId
        }/${this.dateService.getDateFormat(converToDate)}/${this.filtroId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.reporteOrdenesServicioService.setData(this.data);

          if (this.data.length !== 0) {
            this.nameCarpetaFecha = this.dateService.getDateFormat(
              this.data[0].requestDate
            );
            this.urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/ordenServicio/${this.nameCarpetaFecha}/`;
          }
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
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

  onDelete(data: any) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`ServiceOrders/${data.id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
  ngOnChanges() {
    this.subscriber?.unsubscribe();
  }
}
