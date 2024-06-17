import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-account-to-employee',
  templateUrl: './account-to-employee.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class AccountToEmployeeComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdService = inject(CustomerIdService);

  submitting: boolean = false;
  personId: number = 0;
  applicationUserId: string = this.config.data.applicationUserId;
  applicationUserList: any[] = [];

  ngOnInit() {
    this.personId = this.config.data.personId;
    this.onLoadAccount();
  }

  onRadioChange(newValue: string) {
    // Esta función se llamará cada vez que cambie el valor del radio button
    this.applicationUserId = newValue;
    // Realiza las acciones que desees con el nuevo valor aquí
  }

  onSubmit() {
    this.submitting = true;

    this.apiRequestService
      .onGetItem(
        `ApplicationUser/updateaccounttoemployee/${this.personId}/${this.applicationUserId}`
      )
      .then(() => {
        this.ref.close(true);
      });
  }

  onLoadAccount() {
    const urlApi = `Employees/GetListAccountUser/${this.customerIdService.customerId}/${this.personId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.applicationUserList = result;
    });
  }
}
