import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-pending-report',
  templateUrl: './pending-report.component.html',
  standalone: true,
  imports: [CommonModule, ComponentsModule],
  providers: [CustomToastService, MessageService],
})
export default class PendingReportComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  public dataService = inject(DataService);
  public filterReportOperationService = inject(TicketFilterService);
  public reportService = inject(ReportService);
  public router = inject(Router);
  public customToastService = inject(CustomToastService);
  urlImg = '';
  data: any[] = [];
  customerId: number;
  nameCustomer: string = '';
  logoCustomer: string = '';

  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  ngOnInit(): void {
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe((resp) => {
      this.filterReportOperationService.setIdCustomer(
        this.customerIdService.customerId
      );
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.customerId = this.reportService.getCustomerId();
    this.urlImg = `${
      environment.base_urlImg
    }customers/${this.filterReportOperationService.getIdCustomer()}/report/`;
    this.subRef$ = this.dataService
      .post<IFilterTicket>(
        'Ticket/GetReportPending',
        this.filterReportOperationService.getfilterTicket
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
