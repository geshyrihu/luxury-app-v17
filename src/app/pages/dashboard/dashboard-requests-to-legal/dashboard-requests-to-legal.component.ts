import { Component, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import DashboardDynamicCardItemComponent from '../dashboard-dynamic-card-item/dashboard-dynamic-card-item.component';
import LegalSummaryComponent from '../summary-request-to-legal/legal-summary.component';

@Component({
  selector: 'app-dashboard-requests-to-legal',
  standalone: true,
  imports: [LuxuryAppComponentsModule, DashboardDynamicCardItemComponent],
  templateUrl: './dashboard-requests-to-legal.component.html',
})
export default class DashboardRequestsToLegalComponent {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  customerIdService = inject(CustomerIdService);

  // Declaración e inicialización de variables
  data: any;
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  ngOnInit(): void {
    this.onLoadData(this.customerIdService.getCustomerId());
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.customerIdService.getCustomerId());
    });
  }
  onLoadData(customerId: number) {
    const urlApi = `Dashboard/RequestsToLegal/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.data = result;
    });
  }

  // Método para manejar el evento cuando se hace clic en un ticket
  onLoadResumen(status: any) {
    this.dialogHandlerService.openDialog(
      LegalSummaryComponent,
      { status }, // Pasa el groupId al componente del diálogo
      '',
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
