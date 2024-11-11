import { Component, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { IProviderSupportList } from 'src/app/core/interfaces/provider-support-list.interface';
import { ApiRequestService } from 'src/app/core/services/api-request.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogHandlerService } from 'src/app/core/services/dialog-handler.service';
import { environment } from 'src/environments/environment';
import AddOrEditprovidersupportComponent from './add-or-edit-provider-support/add-or-edit-provider-support.component';

@Component({
  selector: 'app-provider-support',
  templateUrl: './provider-support.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class providersupportComponent implements OnInit {
  authS = inject(AuthService);
  dialogService = inject(DialogService);
  apiRequestService = inject(ApiRequestService);
  dialogHandlerService = inject(DialogHandlerService);

  url_img = `${environment.base_urlImg}providers/`;

  // Declaración e inicialización de variables
  data: IProviderSupportList[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }
  // Función para cargar los datos
  onLoadData() {
    this.apiRequestService.onGetList('providersupport').then((result: any) => {
      this.data = result;
    });
  }

  //Modal Agregar o editar
  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un banco
  onModalAddOrEdit(data: any) {
    this.dialogHandlerService
      .openDialog(
        AddOrEditprovidersupportComponent,
        data,
        data.title,
        this.dialogHandlerService.dialogSizeMd
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  // Función para eliminar
  onDelete(id: string) {
    this.apiRequestService
      .onDelete(`providersupport/${id}`)
      .then((result: boolean) => {
        if (result) this.data = this.data.filter((item) => item.id !== id);
      });
  }
}
