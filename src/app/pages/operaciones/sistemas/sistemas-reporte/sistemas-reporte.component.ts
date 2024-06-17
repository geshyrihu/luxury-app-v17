import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { DataService } from 'src/app/core/services/data.service';
import { DateService } from 'src/app/core/services/date.service';
import { FiltroCalendarService } from 'src/app/core/services/filtro-calendar.service';
import { SistemasReporteService } from 'src/app/core/services/sistemas-reporte.service';
import { environment } from 'src/environments/environment';
import CardEmployeeComponent from '../../../employee/card-employee/card-employee.component';
import AddoreditSistemasReporteComponent from '../addoredit-sistemas-reporte/addoredit-sistemas-reporte.component';

@Component({
  selector: 'app-sistemas-reporte',
  templateUrl: './sistemas-reporte.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class SistemasReporteComponent implements OnInit, OnDestroy {
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  dateService = inject(DateService);
  customToastService = inject(CustomToastService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  public sistemasReporteService = inject(SistemasReporteService);
  private filtroCalendarService = inject(FiltroCalendarService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente
  ref: DynamicDialogRef;

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
    this.dataService
      .get(
        `Ticket/SolicitudesSistemas/${fechaInicio}/${fechaFinal}/${this.pendiente}/${this.concluido}/${this.employeeId}`
      )
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
          console.log('🚀 ~           this.data:', this.data);

          if (this.data !== null) {
            this.pendientes = this.onFilterItems(resp.body, 0);
            this.concluidos = this.onFilterItems(resp.body, 1);
          }
          this.sistemasReporteService.setData(this.data);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
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
    this.dataService
      .delete('Ticket/DeleteFinal/' + id)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
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
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  onCardEmployee(personId: number) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        personId,
      },
      header: 'Tarjeta de Usuario',
      styleClass: 'modal-sm',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
