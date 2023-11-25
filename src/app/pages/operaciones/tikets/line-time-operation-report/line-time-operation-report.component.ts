import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';
import AddoreditTicketComponent from '../addoredit-ticket/addoredit-ticket.component';

@Component({
  selector: 'app-line-time-operation-report',
  templateUrl: './line-time-operation-report.component.html',
  standalone: true,
  imports: [NgbAlertModule, CommonModule, ComponentsModule, ToastModule],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class LineTimeOperationReportComponent
  implements OnInit, OnDestroy
{
  public customToastService = inject(CustomToastService);
  public dataService = inject(DataService);
  public customerIdService = inject(CustomerIdService);
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public authService = inject(AuthService);
  ref: DynamicDialogRef;
  data: any = [];
  url = `${environment.base_urlImg}Administration/accounts/`;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();
  subRef$: Subscription;

  base_urlImg = '';

  ngOnInit(): void {
    this.onDepurar();
    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onDepurar() {
    this.subRef$ = this.dataService.get('Depuracion/ReporteSemanal').subscribe({
      // (resp: any) => {},
      error: (err) => {
        this.customToastService.onShowError();
        console.log(err.error);
      },
    });
  }

  onLoadData() {
    this.base_urlImg = `${environment.base_urlImg}customers/${this.customerIdService.customerId}/report/`;
    this.data = [];
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(`Ticket/LineTime/${this.customerIdService.customerId}`)
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

  showModalAddOrEdit(id: any) {
    this.ref = this.dialogService.open(AddoreditTicketComponent, {
      data: {
        id: id.id,
        customerAuthId: this.customerIdService.customerId,
      },
      header: 'Actualizar Registro',
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  onDiferenciaDate(date1, date2) {
    if (date1 !== null && date2 !== null) {
    }
  }
  onCompareFecha(date: Date): boolean {
    if (date !== null) {
      const dateNow = new Date();
      const dateReport = new Date(date);

      if (dateReport.getTime() < dateNow.getTime()) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  onDelete(id: number) {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .delete(`Ticket/DeleteFinal/${id}`)
      .subscribe({
        next: () => {
          this.onLoadData();
          this.customToastService.onCloseToSuccess();
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
