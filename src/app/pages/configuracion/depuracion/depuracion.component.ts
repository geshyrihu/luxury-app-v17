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

  OrdenCompraDatosPago() {
    this.apiRequestService
      .onGetList('UpdateDataBase/OrdenCompraDatosPago')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  CalendarioMaestroProvider() {
    this.apiRequestService
      .onGetList('UpdateDataBase/CalendarioMaestroProvider')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  MaintenanceCalendars() {
    this.apiRequestService
      .onGetList('UpdateDataBase/MaintenanceCalendars')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  CustomerProvider() {
    this.apiRequestService
      .onGetList('UpdateDataBase/CustomerProvider')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  PersonProviderSupport() {
    this.apiRequestService
      .onGetList('UpdateDataBase/PersonProviderSupport')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  ContratoPoliza() {
    this.apiRequestService
      .onGetList('UpdateDataBase/ContratoPoliza')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  EntradaProducto() {
    this.apiRequestService
      .onGetList('UpdateDataBase/EntradaProducto')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  ServiceOrder() {
    this.apiRequestService.onGetList('UpdateDataBase/ServiceOrder').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  CatalogoGastosFijos() {
    this.apiRequestService
      .onGetList('UpdateDataBase/CatalogoGastosFijos')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
}
