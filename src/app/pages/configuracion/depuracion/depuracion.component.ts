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

  UpdatePersonToEmployee() {
    this.apiRequestService
      .onGetList('UpdateDataBase/UpdatePersonToEmployee')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  UpdatePhoneCustomer() {
    this.apiRequestService
      .onGetList('UpdateDataBase/UpdatePhoneCustomer')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  InsertData() {
    this.apiRequestService.onGetList('UpdateDataBase/InsertData').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
}
