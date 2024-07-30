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
  UpdateWeeklyReport(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateCustomerDataCompany(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  UpdateWeeklyReportDepartament(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  GoogleCalendar(path: string) {
    this.apiRequestService.onGetList('GoogleCalendar/').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
}
