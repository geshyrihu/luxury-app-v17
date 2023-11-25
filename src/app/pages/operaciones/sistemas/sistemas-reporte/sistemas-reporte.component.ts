import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import {
  AuthService,
  CustomToastService,
  DataService,
  DateService,
  FiltroCalendarService,
} from 'src/app/core/services/common-services';
import { SistemasReporteService } from 'src/app/core/services/sistemas-reporte.service';
import ComponentsModule from 'src/app/shared/components.module';
import PrimeNgModule from 'src/app/shared/prime-ng.module';
import { environment } from 'src/environments/environment';
import CardEmployeeComponent from '../../directorios/empleados/card-employee/card-employee.component';
import AddoreditSistemasReporteComponent from '../addoredit-sistemas-reporte/addoredit-sistemas-reporte.component';

@Component({
  selector: 'app-sistemas-reporte',
  templateUrl: './sistemas-reporte.component.html',
  standalone: true,
  imports: [ComponentsModule, CommonModule, RouterModule, PrimeNgModule],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
    CustomToastService,
  ],
})
export default class SistemasReporteComponent implements OnInit, OnDestroy {
  public dataService = inject(DataService);
  public dateService = inject(DateService);
  public customToastService = inject(CustomToastService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public sistemasReporteService = inject(SistemasReporteService);
  private filtroCalendarService = inject(FiltroCalendarService);

  ref: DynamicDialogRef;
  subRef$: Subscription;

  base_urlImg = `${environment.base_urlImg}customers/`;
  data: any[] = [];
  listCustomer: any[] = [];

  employeeId: number = this.authService.userTokenDto.infoEmployeeDto.employeeId;
  status: number = 0;
  pendiente: boolean = true;
  concluido: boolean = true;
  pendientes: number = 0;
  concluidos: number = 0;
  url = `${environment.base_urlImg}Administration/accounts/`;
  url_Customer = `${environment.base_urlImg}Administration/customer/`;
  dates$: Observable<Date[]> = this.filtroCalendarService.getDates$();

  ngOnInit(): void {
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
    this.dates$.subscribe((dates) => {
      this.onLoadData(
        this.dateService.getDateFormat(dates[0]),
        this.dateService.getDateFormat(dates[1])
      );
    });
  }

  onFilter(pendiente: boolean, concluido: boolean, employeeId: number): void {
    this.pendiente = pendiente;
    this.concluido = concluido;
    this.employeeId = employeeId;
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
  }

  onLoadData(fechaInicio: string, fechaFinal: string): void {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.subRef$ = this.dataService
      .get(
        `Ticket/SolicitudesSistemas/${fechaInicio}/${fechaFinal}/${this.pendiente}/${this.concluido}/${this.employeeId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.data = resp.body;

          if (this.data !== null) {
            this.pendientes = this.onFilterItems(resp.body, 0);
            this.concluidos = this.onFilterItems(resp.body, 1);
          }
          this.sistemasReporteService.setData(this.data);
          this.customToastService.onClose();
        },
        error: (err) => {
          // En caso de error, mostrar un mensaje de error y registrar el error en la consola
          this.customToastService.onCloseToError();
          console.log(err.error);
        },
      });
  }

  onFilterItems(data: any[], status: number): number {
    const a = data.filter((resp) => resp.status === status);
    return a.length;
  }
  onChangeUser() {
    if (this.employeeId == 0) {
      this.employeeId =
        this.authService.userTokenDto.infoEmployeeDto.employeeId;
    } else {
      this.employeeId = null;
    }
    this.onLoadData(
      this.dateService.getDateFormat(this.filtroCalendarService.fechaInicial),
      this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
    );
  }

  showModalAddOrEdit(id: number) {
    this.ref = this.dialogService.open(AddoreditSistemasReporteComponent, {
      data: {
        id: id,
      },
      header: 'Reporte de operación',
      styleClass: 'modal-lg',
      autoZIndex: true,
      closeOnEscape: true,
    });
    this.ref.onClose.subscribe((resp: any) => {
      if (resp !== undefined) {
        this.onLoadData(
          this.dateService.getDateFormat(
            this.filtroCalendarService.fechaInicial
          ),
          this.dateService.getDateFormat(this.filtroCalendarService.fechaFinal)
        );
        this.customToastService.onShowSuccess();
      }
    });
  }

  eliminarTiket(id: number) {
    this.subRef$ = this.dataService
      .delete('Ticket/DeleteFinal/' + id)
      .subscribe({
        next: () => {
          this.onLoadData(
            this.dateService.getDateFormat(
              this.filtroCalendarService.fechaInicial
            ),
            this.dateService.getDateFormat(
              this.filtroCalendarService.fechaFinal
            )
          );
          this.customToastService.onShowSuccess();
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

  ngOnDestroy() {
    if (this.subRef$) this.subRef$.unsubscribe();
  }
}
