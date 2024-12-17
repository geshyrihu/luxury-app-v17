import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddoreditEventComponent from '../addoredit-event/addoredit-event.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es'; // Importa el paquete de idioma español
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar-detail',
  standalone: true,
  imports: [LuxuryAppComponentsModule, FullCalendarModule],
  templateUrl: './calendar-detail.component.html',
})
export default class CalendarDetailComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  route = inject(ActivatedRoute);

  calendarId: string | null = null;
  calendar: any;
  events: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale, // Define el idioma a español
    events: [],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    selectable: true,
    eventClick: this.onEventClick.bind(this), // Vinculamos el evento
  };

  ngOnInit(): void {
    this.calendarId = this.route.snapshot.paramMap.get('id');
    if (this.calendarId) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.loadCalendarDetails();
    this.loadEvents();
  }

  loadCalendarDetails() {
    if (this.calendarId) {
      const urlApi = `Calendars/${this.calendarId}`;
      this.apiRequestService.onGetItem(urlApi).then((result: any) => {
        this.calendar = result;
      });
    }
  }

  loadEvents() {
    if (this.calendarId) {
      const urlApi = `Calendars/${this.calendarId}/events`;
      this.apiRequestService.onGetItem(urlApi).then((events: any) => {
        this.calendarOptions.events = events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          allDay: event.isAllDay,
          extendedProps: {
            description: event.description,
            location: event.location,
            isRecurring: event.isRecurring,
            recurringPattern: event.recurringPattern,
          },
        }));
      });
    }
  }
  onModalAddOrEditEvent(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddoreditEventComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onEventClick(info: any) {
    const eventId = info.event.id; // Obtener el ID del evento
    this.onModalAddOrEditEvent({ eventId: eventId, title: 'Editar Evento' });
  }
}
