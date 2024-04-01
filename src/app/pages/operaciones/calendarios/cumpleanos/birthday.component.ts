import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DataService } from 'src/app/core/services/data.service';
import CardEmployeeComponent from 'src/app/pages/operaciones/directorios/empleados/card-employee/card-employee.component';
@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FullCalendarModule],
})
export default class BirthdayComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  public customerIdService = inject(CustomerIdService);
  dataService = inject(DataService);
  apiRequestService = inject(ApiRequestService);
  customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);

  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  selectedMonth: number = 3;
  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  selectMonth() {
    console.log('Selected Month:', this.selectedMonth);
    // Aquí puedes realizar cualquier acción que necesites con el ID del mes seleccionado
  }

  calendarOptions: CalendarOptions = {
    locale: esLocale, // Agrega el idioma español
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'prevYear,prev,next,nextYear',
    },
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };
  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends; // toggle the boolean!
  }

  events: any[] = [];
  ref: DynamicDialogRef;
  customerId$: Observable<number> = this.customerIdService.getCustomerId$();

  onLoadData() {
    // this.onLoadData();
    this.customerId$ = this.customerIdService.getCustomerId$();
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();
    this.dataService
      .get('employees/birthday/' + this.customerIdService.customerId)
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          console.log('🚀 ~ resp.body:', resp.body);
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'dayGridMonth,dayGridWeek,dayGridDay',
              center: 'title',
              right: 'prevYear,prev,next,nextYear',
            },
            themeSystem: 'bootstrap5',
            plugins: [dayGridPlugin],
            locales: [esLocale],
            locale: 'es',
            events: resp.body,
            eventClick: this.tarjetaUsuario.bind(this),
          };
          this.customToastService.onClose();
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
      });
  }

  tarjetaUsuario(clickInfo: EventClickArg) {
    this.ref = this.dialogService.open(CardEmployeeComponent, {
      data: {
        employeeId: clickInfo.event._def.publicId,
      },
      header: 'Datos de usuario',
      styleClass: 'modal-md',
      closeOnEscape: true,
      baseZIndex: 10000,
    });
  }
  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }
}
