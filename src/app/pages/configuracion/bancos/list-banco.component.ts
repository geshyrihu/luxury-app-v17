import { Component, OnInit, inject, signal } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { ApiRequestService } from '../../../core/services/api-request.service';
import AddOrEditBancoComponent from './addoredit-banco.component';

@Component({
  selector: 'app-banco',
  templateUrl: './list-banco.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class ListBancoComponent implements OnInit {
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);
  // googleCalendarService = inject(GoogleCalendarService);

  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    this.onLoadData();
    // this.loadEvents();
  }
  // events: any[] = [];
  // loadEvents() {
  //   this.googleCalendarService.onTestCalendar();
  // }

  onLoadData() {
    const urlApi = `banks`;
    this.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(result);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestService.onDelete(`banks/${id}`).then((result: boolean) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.set(this.dataSignal().filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditBancoComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
