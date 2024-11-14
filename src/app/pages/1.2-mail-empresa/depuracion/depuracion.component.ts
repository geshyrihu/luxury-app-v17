import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-depuracion',
  templateUrl: './depuracion.component.html',
  imports: [LuxuryAppComponentsModule],
  standalone: true,
})
export default class DepuracionComponent {
  apiRequestService = inject(ApiRequestService);
  customerIdService = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  ImportTickets(path: string) {
    this.apiRequestService
      .onGetList(
        'UpdateDataBase/' + path + '/' + this.customerIdService.customerId
      )
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  DeleteDuplicate(path: string) {
    this.apiRequestService
      .onGetList(
        'UpdateDataBase/' + path + '/' + this.customerIdService.customerId
      )
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  GenerateFolio(path: string) {
    this.apiRequestService
      .onGetList(
        'UpdateDataBase/' + path + '/' + this.customerIdService.customerId
      )
      .then(() => {
        this.customToastService.onShowSuccess();
        this.customToastService.onClose();
      });
  }
  UpdateTicketLegal(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  SendEmailPending(path: string) {
    this.apiRequestService.onGetList('LegalReport/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  SendLegalTicketReportToCustomer(path: string) {
    this.apiRequestService.onGetList('Reports/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
  GenerateSignalEvent(path: string) {
    this.apiRequestService.onGetList('UpdateDataBase/' + path).then(() => {
      this.customToastService.onShowSuccess();
      this.customToastService.onClose();
    });
  }
}
