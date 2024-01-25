import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import DashboardTicketsResumenComponent from '../dashboard-tickets-resumen/dashboard-tickets-resumen.component';

@Component({
  selector: 'app-dashboard-tickets',
  standalone: true,
  imports: [RouterModule, NgbAlertModule, CommonModule],
  templateUrl: './dashboard-tickets.component.html',
  providers: [DialogService, CustomToastService],
})
export default class DashboardTicketsComponent implements OnInit, OnDestroy {
  public dataServide = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public dialogService = inject(DialogService);
  public customToastService = inject(CustomToastService);

  data: any[] = [];
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  ref: DynamicDialogRef;
  subRef$: Subscription;

  ngOnInit(): void {
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataServide
      .get(
        'Dashboard/TicketPendientes/' + this.customerIdService.getcustomerId()
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }
  onLoadResumen(responsibleAreaId: number) {
    this.ref = this.dialogService.open(DashboardTicketsResumenComponent, {
      data: {
        responsibleAreaId,
      },
      header: 'Pendientes',

      height: '100%',
      width: '100%',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
