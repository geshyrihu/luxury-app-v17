import { Component, inject } from '@angular/core';
import {
  ApiRequestService,
  CustomToastService,
} from 'src/app/core/services/common-services';
import CustomButtonModule from 'src/app/custom-components/custom-buttons/custom-button.module';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [CustomButtonModule],
  standalone: true,
})
export default class DepuracionComponent {
  public apiRequestService = inject(ApiRequestService);
  public customToastService = inject(CustomToastService);

  ActualizarDatosEmpleadoContatoData() {
    this.apiRequestService
      .onGetList('Depuracion/ActualizarDatosEmpleadoContatoData')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }

  UpdateAccounts() {
    this.apiRequestService.onGetList('depuracion/updateaccounts').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  DeleteFolios() {
    this.apiRequestService.onGetList('depuracion/DeleteFolios').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateFinancieros() {
    this.apiRequestService
      .onGetList('depuracion/UpdateFinancieros')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
}
