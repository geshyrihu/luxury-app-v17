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

  TypePerson() {
    this.apiRequestService.onGetList('UpdateDataBase/TypePerson').then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }

  CondominoToPerson() {
    this.apiRequestService
      .onGetList('UpdateDataBase/CondominoToPerson')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  MeetingComiteToMeetingAdministracion() {
    this.apiRequestService
      .onGetList('UpdateDataBase/MeetingComiteToMeetingAdministracion')
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
}
