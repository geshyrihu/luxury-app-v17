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

  ActualizarDatosEmpleadoContatoData() {
    this.apiRequestService
      .onGetList('Depuracion/ActualizarDatosEmpleadoContatoData')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }

  UpdateAccounts() {
    this.apiRequestService
      .onGetList('UpdateDataBase/updateaccounts')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  DeleteFolios() {
    this.apiRequestService.onGetList('UpdateDataBase/DeleteFolios').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateFinancieros() {
    this.apiRequestService
      .onGetList('UpdateDataBase/UpdateFinancieros')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  UpdateCotizacionProveedor() {
    this.apiRequestService
      .onGetList('UpdateDataBase/UpdateCotizacionProveedor')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
}
