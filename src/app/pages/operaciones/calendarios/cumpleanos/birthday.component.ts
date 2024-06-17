import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import CardEmployeeComponent from 'src/app/pages/employee/card-employee/card-employee.component';
@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FullCalendarModule],
})
export default class BirthdayComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  authService = inject(AuthService);
  customerIdService = inject(CustomerIdService);

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

  ngOnInit() {
    this.onLoadData();
    this.customerId$.subscribe(() => {
      this.onLoadData();
    });
  }
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
    this.apiRequestService
      .onGetList('employees/birthday/' + this.customerIdService.customerId)
      .then((result: any) => {
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
          events: result,
          eventClick: this.tarjetaUsuario.bind(this),
        };
      });
  }

  tarjetaUsuario(clickInfo: EventClickArg) {
    this.dialogHandlerService.openDialog(
      CardEmployeeComponent,
      {
        personId: clickInfo.event._def.extendedProps.personId,
      },
      'Datos de usuario',
      this.dialogHandlerService.dialogSizeMd
    );
  }
}
