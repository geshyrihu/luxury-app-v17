import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  CustomerIdService,
  DataService,
} from 'src/app/core/services/common-services';
import ComponentsModule from 'src/app/shared/components.module';
import { environment } from 'src/environments/environment';

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
  public route = inject(ActivatedRoute);
  ref: DynamicDialogRef;
  data: any = [];
  url = `${environment.base_urlImg}Administration/accounts/`;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  base_urlImg = '';

  year: number;
  week: number;

  ngOnInit(): void {
    // Accede a los parámetros de la ruta y asígnales a las variables
    this.route.params.subscribe((params) => {
      this.year = +params['year']; // Convierte a número
      this.week = +params['week']; // Convierte a número
    });

    this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }

  onLoadData() {}

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
