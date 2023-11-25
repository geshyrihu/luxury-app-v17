import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { IFilterTicket } from 'src/app/core/interfaces/IFilterTicket.interface';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
  ReportService,
  TicketFilterService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-operation-report',
  templateUrl: './reporte-operacion.component.html',
  standalone: true,
  imports: [RouterModule, ComponentsModule, CommonModule],
  providers: [CustomToastService, MessageService],
})
export default class ReporteOperacionComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public reportService = inject(ReportService);
  public ticketFilterService = inject(TicketFilterService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  urlImg = '';
  data: any[] = [];
  customerId: number;
  nameCustomer: string = '';
  logoCustomer: string = '';
  roleMantenimiento: boolean = false;

  fechaInicial = '';
  fechaFinal = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  ngOnInit(): void {
    this.fechaInicial = this.ticketFilterService.filterTicket.finishedStart;
    this.fechaFinal = this.ticketFilterService.filterTicket.finishedEnd;
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.ticketFilterService.setIdCustomer(this.customerIdService.customerId);
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.urlImg = `${environment.base_urlImg}customers/${this.ticketFilterService.filterTicket.customer}/report/`;

    this.subRef$ = this.dataService
      .post<IFilterTicket>(
        'Ticket/GetReportWeekly',
        this.ticketFilterService.filterTicket
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
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
