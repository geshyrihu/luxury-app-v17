import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-reporte-ticket-pendientes-proveedor',
  templateUrl: './reporte-ticket-pendientes-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteTicketPendientesProveedorComponent
  implements OnInit
{
  authS = inject(AuthService);
  apiRequestService = inject(ApiRequestService);
  reportService = inject(ReportService);
  router = inject(Router);
  routerActivate = inject(ActivatedRoute);

  customerId: string;
  departamentId: string;

  urlImg = '';
  data: any[] = [];
  nameCustomer: string = '';
  logoCustomer: string = '';

  ngOnInit(): void {
    this.customerId = this.routerActivate.snapshot.params['customerId'];
    this.departamentId = this.routerActivate.snapshot.params['departamentId'];

    this.onLoadData();
  }
  onLoadData() {
    const urlApi = `ticket/getreportpendingprovider/${this.customerId}/${this.departamentId}`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      this.data = result;
    });
  }
}
