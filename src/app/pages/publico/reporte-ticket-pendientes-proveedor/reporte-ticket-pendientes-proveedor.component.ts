import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import ComponentsModule from 'app/shared/components.module';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
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
  imports: [CommonModule, ComponentsModule],
  providers: [CustomToastService, MessageService],
})
export default class ReporteTicketPendientesProveedorComponent
  implements OnInit
{
  public authService = inject(AuthService);
  public dataService = inject(DataService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);
  public routerActivate = inject(ActivatedRoute);

  customerId: string;
  departamentId: string;

  urlImg = '';
  data: any[] = [];
  nameCustomer: string = '';
  logoCustomer: string = '';

  subRef$: Subscription;

  ngOnInit(): void {
    this.customerId = this.routerActivate.snapshot.params['customerId'];
    this.departamentId = this.routerActivate.snapshot.params['departamentId'];

    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.urlImg = `${environment.base_urlImg}customers/${this.customerId}/report/`;

    console.log('🚀 ~ this.urlImg:', this.urlImg);
    this.subRef$ = this.dataService
      .get(
        `ticket/getreportpendingprovider/${this.customerId}/${this.departamentId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          console.log('🚀 ~ resp.body:', resp.body);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
