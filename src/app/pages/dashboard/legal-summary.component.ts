import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-legal-summary',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  templateUrl: './legal-summary.component.html',
})
export default class LegalSummaryComponent {
  apiRequestService = inject(ApiRequestService);
  config = inject(DynamicDialogConfig);
  custIdService = inject(CustomerIdService);
  data: any[] = [];

  status: number = 0;

  ngOnInit(): void {
    this.status = this.config.data.status;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `Dashboard/LegalSummary/${this.custIdService.getCustomerId()}/${
      this.status
    }`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
