import { Component, OnChanges, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DateService } from 'src/app/core/services/date.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ReporteOrdenesServicioService } from 'src/app/core/services/reporte-ordenes-servicio.service';
import SubirPdfComponent from 'src/app/shared/subir-pdf/subir-pdf.component';
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
  implements OnInit, OnChanges
{
  apiRequestS = inject(ApiRequestService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  reporteOrdenesServicioService = inject(ReporteOrdenesServicioService);
  dateS = inject(DateService);
  dialogHandlerS = inject(DialogHandlerService);

  mm = date.getMonth() + 1;
  fecha = [date.getFullYear(), (this.mm > 9 ? '' : '0') + this.mm].join('-');

  data: any[] = [];
  observations: [''];
  ref: DynamicDialogRef;

  // urlImg: string = '';
  nameCarpetaFecha = '';
  customerId$: Observable<number> = this.customerIdS.getCustomerId$();

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
    this.customerId$ = this.customerIdS.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe((resp) => {
      this.onReloadOrdenes(this.filtroId, this.filtroEquiposValue);
    });
  }

  onModalFormUploadImg(id: number) {
    this.dialogHandlerS
      .openDialog(
        FormUploadImgComponent,
        {
          serviceOrderId: id,
        },
        'Cargar Imagenes',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalFormUploadDoc(id: number) {
    this.dialogHandlerS
      .openDialog(
        SubirPdfComponent,
        {
          serviceOrderId: id,
          pathUrl: 'ServiceOrders/SubirDocumento/',
        },
        'Cargar Documentos',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalFotos(id: number) {
    this.dialogHandlerS
      .openDialog(
        OrdenesServicioFotosComponent,
        {
          id,
        },
        'Soporte Fotografico',
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onModalRpeorteProveedor(id: number) {
    this.dialogHandlerS
      .openDialog(
        OrdenesServicioReporteProveedorComponent,
        {
          id,
        },
        'Reportes de proveedor',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onLoadPintura() {
    let converToDate = new Date(this.fecha + '-' + 1);
    this.reporteOrdenesServicioService.setDate(converToDate);

    const urlApi = `ServiceOrders/GetAllPintura/${
      this.customerIdS.customerId
    }/${this.dateS.getDateFormat(converToDate)}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.reporteOrdenesServicioService.setData(this.data);

      if (this.data.length !== 0) {
        this.nameCarpetaFecha = this.dateS.getDateFormat(
          this.data[0].requestDate
        );
      }
    });
  }
  onLoadData() {
    let converToDate = new Date(this.fecha + '-' + 1);
    this.reporteOrdenesServicioService.setDate(converToDate);

    const urlApi = `ServiceOrders/GetAll/${
      this.customerIdS.customerId
    }/${this.dateS.getDateFormat(converToDate)}/${this.filtroId}`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      this.data = result;
      this.reporteOrdenesServicioService.setData(this.data);

      if (this.data.length !== 0) {
        this.nameCarpetaFecha = this.dateS.getDateFormat(
          this.data[0].requestDate
        );
      }
    });
  }

  onEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        ServiceOrderAddOrEditComponent,
        {
          id: data.id,
          machineryId: data.machineryId,
          providerId: data.providerId,
        },
        data.title,
        this.dialogHandlerS.dialogSizeFull
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: number) {
    this.apiRequestS.onDelete(`ServiceOrders/${id}`).then((result: boolean) => {
      if (result) this.data = this.data.filter((item) => item.id !== id);
    });
  }

  ngOnChanges() {
    this.subscriber?.unsubscribe();
  }
}
