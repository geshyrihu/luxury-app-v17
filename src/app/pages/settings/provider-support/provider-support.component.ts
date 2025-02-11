import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProviderSupportList } from 'src/app/core/interfaces/provider-support-list.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import AddOrEditprovidersupportComponent from './add-or-edit-provider-support/add-or-edit-provider-support.component';

@Component({
    selector: 'app-provider-support',
    templateUrl: './provider-support.component.html',
    imports: [LuxuryAppComponentsModule]
})
export default class providersupportComponent implements OnInit {
  authS = inject(AuthService);
  dialogS = inject(DialogService);
  apiRequestS = inject(ApiRequestService);
  dialogHandlerS = inject(DialogHandlerService);

  // Declaración e inicialización de variables
  data: IProviderSupportList[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  ngOnInit(): void {
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }
  // Función para cargar los datos
  onLoadData() {
    this.apiRequestS.onGetList('providersupport').then((responseData: any) => {
      this.data = responseData;
    });
  }

  //Modal Agregar o editar
  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un banco
  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        AddOrEditprovidersupportComponent,
        data,
        data.title,
        this.dialogHandlerS.dialogSizeMd
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }
  // Función para eliminar
  onDelete(id: string) {
    this.apiRequestS
      .onDelete(`providersupport/${id}`)
      .then((responseData: boolean) => {
        if (responseData)
          this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
