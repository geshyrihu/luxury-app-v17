import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
  ReportService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reporte-ticket-pendientes-proveedor',
  templateUrl: './reporte-ticket-pendientes-proveedor.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ReporteTicketPendientesProveedorComponent
  implements OnInit
{
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public apiRequestService = inject(ApiRequestService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);
  public routerActivate = inject(ActivatedRoute);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

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
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.urlImg = `${environment.base_urlImg}customers/${this.customerId}/report/`;

    this.dataService
      .get(
        `ticket/getreportpendingprovider/${this.customerId}/${this.departamentId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
