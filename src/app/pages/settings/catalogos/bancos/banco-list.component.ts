import { Component, OnInit, inject, signal } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import BancoAddOrEditComponent from './banco-addoredit.component';

@Component({
  selector: 'app-banco-list',
  templateUrl: './banco-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class BancoListComponent implements OnInit {
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `banks`;
    this.apiRequestS.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(result);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.apiRequestS.onDelete(`banks/${id}`).then((result: boolean) => {
      // Actualizamos el signal para eliminar el elemento de la lista
      this.dataSignal.set(this.dataSignal().filter((item) => item.id !== id));
    });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        BancoAddOrEditComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
