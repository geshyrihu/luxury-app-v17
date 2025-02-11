import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import LegalTicketAddComponent from './legal-ticket-add.component';
import { TicketTrakingCustomerComponent } from './ticket-traking-customer.component';
import TicketTrakingRequestDetailComponent from './ticket-traking-request-detail.component';

@Component({
    selector: 'app-legal-list-ticket-customer',
    templateUrl: './legal-list-ticket-customer.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class LegalListTicketComponent implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiRequestS = inject(ApiRequestService);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiRequestS
      .onGetList(`TicketLegal/All/${this.customerIdS.getCustomerId()}`)
      .then((responseData: any) => {
        this.data = responseData;
      });
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        LegalTicketAddComponent,
        data,
        '',
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) {
          this.onLoadData();
        }
      });
  }

  onModalSeguimientoCliente(data: any) {
    this.dialogHandlerS.openDialog(
      TicketTrakingCustomerComponent,
      data,
      '',
      this.dialogHandlerS.dialogSizeMd
    );
  }
  onModalViewDetail(data: any) {
    this.dialogHandlerS.openDialog(
      TicketTrakingRequestDetailComponent,
      data,
      '',
      this.dialogHandlerS.dialogSizeMd
    );
  }
}
