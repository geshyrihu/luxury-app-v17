import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
    selector: 'app-legal-summary',
    imports: [LuxuryAppComponentsModule],
    templateUrl: './legal-summary.component.html'
})
export default class LegalSummaryComponent {
  apiRequestS = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  data: any[] = [];

  status: number = 0;

  ngOnInit(): void {
    this.status = this.config.data.status;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Dashboard/LegalSummary/${this.customerIdS.getCustomerId()}/${
      this.status
    }`;
    this.apiRequestS.onGetList(urlApi).then((responseData: any) => {
      this.data = responseData;
    });
  }
}
