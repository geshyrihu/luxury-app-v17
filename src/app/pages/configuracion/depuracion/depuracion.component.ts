import { Component, inject } from '@angular/core';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonModule],
  standalone: true,
})
export default class DepuracionComponent {
  apiRequestService = inject(ApiRequestService);
  customToastService = inject(CustomToastService);

  HistorialAcceso(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  CedulaPresupuestalDetalle(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  MaintenanceCalendar(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }

  Producto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  Provider(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  QualificationProvider(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  InventarioExtintor(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  InventarioIluminacion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  InventarioLlave(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  InventarioPintura(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  InventarioProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  RadioComunicacion(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  EntradaProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  SalidaProducto(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  MeetingDetails(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  BitacoraMantenimiento(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  Machinery(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  MedidorLectura(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  CatalogoGastosFijos(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  OrdenCompra(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  OrdenCompraAuth(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  SolicitudCompra(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  SolicitudCompraDetalle(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  AgendaSupervision(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  BitacoraMantenimientoDelete(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
}
