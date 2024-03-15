import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EStatus } from 'src/app/core/enums/status.enum';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-legal-ticket-update-status',
  templateUrl: './legal-ticket-update-status.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class LegalTicketUpdateStatusComponent implements OnInit {
  public apiRequestService = inject(ApiRequestService);
  public auhtService = inject(AuthService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);

  loading = false;
  status: EStatus = 0;
  id = this.config.data.id;

  ngOnInit() {
    this.onLoadData();
  }

  // Función para cargar los datos de los bancos
  onLoadData() {
    this.apiRequestService
      .onGetList(`TicketLegal/status/${this.id}`)
      .then((result: any) => {
        this.status = result.status;
        console.log('🚀 ~ result.status:', result);
      });
  }
  onSubmit() {
    this.apiRequestService
      .onGetItem(`TicketLegal/updatestatus/${this.id}/${this.status}`)
      .then((result: any) => {
        console.log('🚀 ~ result:', result);

        if (result) {
          this.ref.close(true);
        }
      });
  }
}
