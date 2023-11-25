import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  FiltroCalendarService,
  SistemasReporteService,
} from 'src/app/core/services/common-services';
import CardEmployeeComponent from '../../directorios/empleados/card-employee/card-employee.component';

@Component({
  selector: 'app-sistemas-reporte-pdf',
  templateUrl: './sistemas-reporte-pdf.component.html',
  standalone: true,
  imports: [CommonModule, TableModule],
  providers: [DialogService, MessageService, CustomToastService],
})
export default class SistemasReportePdfComponent implements OnInit, OnDestroy {
  public customToastService = inject(CustomToastService);
  public sistemasReporteService = inject(SistemasReporteService);
  public dataService = inject(DataService);
  public authService = inject(AuthService);
  private rangoCalendarioService = inject(FiltroCalendarService);
  public dialogService = inject(DialogService);
  data: any[] = [];
  datosUser: any;
  subRef$: Subscription;
  ref: DynamicDialogRef;

  fechaInicioDate = this.rangoCalendarioService.fechaInicial;
  fechaFinalDate = this.rangoCalendarioService.fechaFinal;

  ngOnInit() {
    this.data = this.sistemasReporteService.dataReport;
    this.onLoadData();
  }

  onLoadData() {
    this.subRef$ = this.dataService
      .get(
        'Sistemas/GetUserData/' +
          this.authService.userTokenDto.infoUserAuthDto.applicationUserId
      )
      .subscribe({
        next: (resp: any) => {
          this.datosUser = resp.body;
        },
        error: (err) => {
          this.customToastService.onShowError();
          console.log(err.error);
        },
      });
  }
  onCardEmployee(employeeId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId,
      },
      header: 'Tarjeta de Usuario',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnDestroy(): void {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
