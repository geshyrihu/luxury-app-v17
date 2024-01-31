import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import LuxuryAppComponentsModule from 'app/shared/luxuryapp-components.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import {
  ApiRequestService,
  AuthService,
  CustomToastService,
  DataService,
} from 'src/app/core/services/common-services';
import { environment } from 'src/environments/environment';
import AddOrEditprovidersupportComponent from './add-or-edit-provider-support/add-or-edit-provider-support.component';

@Component({
  selector: 'app-provider-support',
  templateUrl: './provider-support.component.html',
  standalone: true,
  imports: [LuxuryAppComponentsModule],
})
export default class providersupportComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  public authService = inject(AuthService);
  public customToastService = inject(CustomToastService);
  public dialogService = inject(DialogService);
  public messageService = inject(MessageService);
  public apiRequestService = inject(ApiRequestService);

  url_img = `${environment.base_urlImg}providers/`;

  // Declaración e inicialización de variables
  data: ProviderSupportListDto[] = [];
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  private destroy$ = new Subject<void>(); // Utilizado para la gestión de recursos al destruir el componente

  ngOnInit(): void {
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }
  // Función para cargar los datos
  onLoadData() {
    // Mostrar un mensaje de carga
    this.customToastService.onLoading();

    // Realizar una solicitud HTTP para obtener datos
    this.dataService
      .get('providersupport')
      .pipe(takeUntil(this.destroy$)) // Cancelar la suscripción cuando el componente se destruye
      .subscribe({
        next: (resp: any) => {
          this.data = this.customToastService.onCloseOnGetData(resp.body);
        },
        error: (error) => {
          this.customToastService.onCloseToError(error);
        },
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

  //Modal Agregar o editar
  // Función para abrir un cuadro de diálogo modal para agregar o editar información sobre un banco
  onModalAddOrEdit(data: any) {
    this.ref = this.dialogService.open(AddOrEditprovidersupportComponent, {
      data: {
        id: data.id,
      },
      header: data.title,
      styleClass: 'modal-md ',
      closeOnEscape: true,
      baseZIndex: 10000,
    });

    // Escuchar el evento 'onClose' cuando se cierra el cuadro de diálogo
    this.ref.onClose.subscribe((resp: boolean) => {
      if (resp) {
        // Cuando se recibe 'true', mostrar un mensaje de éxito y volver a cargar los datos
        this.customToastService.onShowSuccess();
        this.onLoadData();
      }
    });
  }

  ngOnDestroy(): void {
    // Cuando se destruye el componente, desvincular y liberar recursos
    this.destroy$.next();
    this.destroy$.complete();
  }
}
export interface ProviderSupportListDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  providerId: number;
  nameProvider: string;
  nameComercial: string;
  professionId: number;
  nameProfession: string;
}
