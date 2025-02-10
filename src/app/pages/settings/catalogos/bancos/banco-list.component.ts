import { Component, OnInit, inject, signal } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedServices } from 'src/app/core/services/shared-services';
import BancoAddOrEditComponent from './banco-addoredit.component';

@Component({
  selector: 'app-banco-list',
  templateUrl: './banco-list.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
  providers: [SharedServices],
})
export default class BancoListComponent implements OnInit {
  uow = inject(SharedServices);

  // Declaración e inicialización de variables
  dataSignal = signal<any>(null);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = `banks`;
    this.uow.apiRequestService.onGetList(urlApi).then((result: any) => {
      // Actualizamos el valor del signal con los datos recibidos
      this.dataSignal.set(result);
    });
  }

  // Funcion para eliminar un banco y refres
  onDelete(id: number) {
    this.uow.apiRequestService
      .onDelete(`banks/${id}`)
      .then((result: boolean) => {
        // Actualizamos el signal para eliminar el elemento de la lista
        this.dataSignal.set(this.dataSignal().filter((item) => item.id !== id));
      });
  }

  // Función para abrir un cuadro de diálogo modal para agregar o editar o crear
  onModalAddOrEdit(data: any) {
    this.uow.dialogHandlerService
      .openDialog(
        BancoAddOrEditComponent,
        data,
        data.title,
        this.uow.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
