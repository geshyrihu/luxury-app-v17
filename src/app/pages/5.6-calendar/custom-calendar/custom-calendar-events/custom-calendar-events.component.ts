// import { Component, inject, OnInit } from '@angular/core';
// import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
// import { ApiRequestService } from 'src/app/core/services/api-request.service';

// import { DataConnectorService } from 'src/app/core/services/data.service';

@Component({
//   selector: 'app-custom-calendar-events',
//   templateUrl: './custom-calendar-events.component.html',
//   standalone: true,
//   imports: [LuxuryAppComponentsModule],
// })
// export default class CustomCalendarEventsComponent implements OnInit {
//   apiRequestService = inject(ApiRequestService);

//   events: any[] = [];
//   isLoading: boolean = false;
//   ngOnInit() {
//     this.onLoadData();
//   }

//   onLoadData() {
//     this.isLoading = true;
//     const urlApi = `calendars/events`; // Endpoint para obtener todos los calendarios
//     this.apiRequestService.onGetList(urlApi).then((result: any) => {
//       this.events = result; // Asigna los datos recibidos
//       this.isLoading = false; // Ocultar el indicador de carga
//       // Aquí puedes manejar los datos, como mostrarlos en tu componente
//     });
//   }

//   onLoadCalendarById(calendarId: string) {
//     const urlApi = `calendars/${calendarId}`; // Endpoint para obtener un calendario por ID
//     this.apiRequestService.onGetItem(urlApi).then((calendar: any) => {
//       // Maneja los datos del calendario
//     });
//   }

//   onCreateEvent(calendarId: string, eventData: any) {
//     const urlApi = `calendars/${calendarId}/events`; // Endpoint para crear un evento en un calendario
//     this.apiRequestService.onPost(urlApi, eventData).then((response: any) => {
//       // Aquí puedes manejar la respuesta, como actualizar la vista de eventos
//     });
//   }

//   onUpdateEvent(calendarId: string, eventId: string, updatedEventData: any) {
//     const urlApi = `calendars/${calendarId}/events/${eventId}`; // Endpoint para actualizar un evento
//     this.apiRequestService
//       .onPut(urlApi, updatedEventData)
//       .then((response: any) => {
//         // Maneja la actualización de los datos en la vista
//       });
//   }
//   onDeleteEvent(calendarId: string, eventId: string) {
//     const urlApi = `calendars/${calendarId}/events/${eventId}`; // Endpoint para eliminar un evento
//     this.apiRequestService.onDelete(urlApi).then((deleted: boolean) => {
//       if (deleted) {
//         // Actualiza la lista de eventos después de la eliminación
//       }
//     });
//   }
//   onAddReminderToEvent(calendarId: string, eventId: string, reminderData: any) {
//     const urlApi = `calendars/${calendarId}/events/${eventId}/reminders`; // Endpoint para agregar un recordatorio
//     this.apiRequestService
//       .onPost(urlApi, reminderData)
//       .then((response: any) => {
//         // Actualiza los recordatorios del evento
//       });
//   }
// }
