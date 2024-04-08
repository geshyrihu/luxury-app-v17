import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import DashboardMinutasResumenComponent from '../dashboard-minutas-resumen/dashboard-minutas-resumen.component';

@Component({
  selector: 'app-dashboard-minutas',
  templateUrl: './dashboard-minutas.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class DashboardMinutasComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  data: any = [];
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData(this.customerIdService.getcustomerId());
    this.customerId$.subscribe((resp) => {
      this.onLoadData(this.customerIdService.getcustomerId());
    });
  }

  onLoadData(customerId: number) {
    const urlApi = `Dashboard/MinutasPendientes/${customerId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }

  onModalAddOrEditMinutaDetalle(eAreaMinutasDetalles: number) {
    let titulo: string = '';

    if (eAreaMinutasDetalles == 0) {
      titulo = 'Contable';
    }
    if (eAreaMinutasDetalles == 1) {
      titulo = 'Operaciones';
    }
    if (eAreaMinutasDetalles == 2) {
      titulo = 'Legal';
    }

    this.dialogHandlerService.openDialog(
      DashboardMinutasResumenComponent,
      {
        eAreaMinutasDetalles,
      },
      'Pendientes ' + titulo,
      this.dialogHandlerService.dialogSizeFull
    );
  }
}
