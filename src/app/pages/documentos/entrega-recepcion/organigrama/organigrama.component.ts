import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-organigrama',
  templateUrl: './organigrama.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class OrganigramaComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  custIdService = inject(CustomerIdService);

  data: TreeNode[];

  customerId$: Observable<number> = this.custIdService.getCustomerId$();

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    const urlApi = `EntregaRecepcion/Organigrama/${this.custIdService.customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
